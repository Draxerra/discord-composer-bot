import { Message, RichEmbedOptions, RichEmbed } from 'discord.js';

const pageText = (page: number) => ` (Page ${page})`;

class BasePagination {
    public embed: RichEmbedOptions[] = [];
    public async send(handler: Message, index = 0) {
        const msg = await handler.channel.send(new RichEmbed(this.embed[index]));
        if (!Array.isArray(msg) && this.embed.length > 1) {
            msg.awaitReactions((reaction, user) => {
                return ["◀", "⬅", "➡", "▶"].includes(reaction.emoji.name) && user.id !== msg.author.id
            }, { max: 1 }).then(collection => {
                msg.delete();
                const reaction = collection.first();
                switch(reaction.emoji.name) {
                    case "◀":
                        this.send(handler, 0);
                        break;
                    case "⬅":
                        this.send(handler, index - 1);
                        break;
                    case "➡":
                        this.send(handler, index + 1);
                        break;
                    case "▶":
                        this.send(handler, this.embed.length - 1);
                        break;
                    default:
                        break;
                }
            });
            if (index !== 0) {
                await msg.react("◀").catch();
            }
            if (index > 0) {
                await msg.react("⬅").catch();
            }
            if (index < this.embed.length - 1) {
                await msg.react("➡").catch();
            }
            if (index !== this.embed.length - 1) {
                await msg.react("▶").catch();
            }
        }
    }
}

export class EmbedPagination extends BasePagination {
    public constructor(embed: RichEmbedOptions) {
        super();

        const currCharCount = Object.values(embed).reduce((count: number, val) => {
            return val && typeof val !== "object" ? count + val.toString().length : count;
        }, 0);

        const fields = chunkArray({
            fields: embed.fields || [],
            indexLimit: 25,
            charLimit: 6000,
            currCharCount
        });

        this.embed = fields.length ? fields.map((field, i) => {
            return {
                ...embed,
                title: embed.title + (fields.length > 1 ? pageText(i+1) : ""),
                fields: field
            };
        }) : [embed];
    }
}

interface IExtendedRichEmbedOptions extends RichEmbedOptions {
    wordSeperator: string;
};
export class DescriptionPagination extends BasePagination {
    public constructor(embed: IExtendedRichEmbedOptions) {
        super();

        const descriptions = chunkText({
            text: embed.description || "",
            limit: 2048,
            join: embed.wordSeperator
        });

        this.embed = descriptions.map((description, i) => {
            return {
                ...embed,
                title: embed.title + (descriptions.length > 1 ? pageText(i+1) : ""),
                description
            }
        });
    }
}

type TEmbedFields = RichEmbedOptions["fields"];
interface IChunkArrayOptions {
    fields?: TEmbedFields;
    indexLimit: number;
    charLimit: number;
    currCharCount: number;
}
const chunkArray = ({fields = [], indexLimit, charLimit, currCharCount}: IChunkArrayOptions): TEmbedFields[] => {
    const copies = fields.reduce((splitPoints, field, i) => {
        const curr = splitPoints[splitPoints.length - 1];
        const page = pageText(splitPoints.length || 1).length;

        // If no split point is defined, add the first split point.
        // Set the start and end to the full array length for now.
        if (!curr) {
            const count = field.name.length + field.value.length + currCharCount + page;
            splitPoints.push({
                start: i,
                count,
                end: fields.length
            });
        
        // Split point is defined.
        } else {
            const count = field.name.length + field.value.length;

            // Add the count to the current split point if it doesn't exceed the text limit, and the index limit.
            if (curr.count + count < charLimit && i - curr.start < indexLimit) {
                curr.count += count;

            // A limit would have been exceeded.
            // Set the end point of the current split point to the previous index.
            // Create a new split point starting from the previous index to the end of the array.
            } else {
                curr.end = i;
                splitPoints.push({
                    start: i,
                    count: count + currCharCount + page,
                    end: fields.length
                });
            }
        }
        return splitPoints;
    }, [] as { count: number; start: number; end: number; }[]);
    return copies.map(i => fields.slice(i.start, i.end));
}

interface IChunkTextArgs {
    join: string;
    text: string;
    limit: number;
}
const chunkText = ({ join, text, limit }: IChunkTextArgs) => {
    return text.split(join).reduce((acc: string[][], word) => {
        if (acc[acc.length - 1].join(join).length + word.length + join.length > limit) {
            acc.push([]);
        }
        acc[acc.length - 1].push(word);
        return acc;
    }, [[]]).map(a => {
        return a.join(join);
    });
}
