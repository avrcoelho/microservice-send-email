import { Readable } from 'stream';
import CsvParse from 'csv-parse';

import Tag from '@schemas/Tag';
import Contact from '@schemas/Contact';

class ImportContactsService {
  async run(contactsFileStream: Readable, tags: string[]): Promise<void> {
    const parsers = CsvParse({
      delimiter: ';'
    });

    const parseCsv = contactsFileStream.pipe(parsers);

    const existentTags = await Tag.find({
      title: {
        $in: tags,
      }
    });

    const existsTagsTiltes = existentTags.map(tag => tag.title);

    const newTagsData = tags
      .filter(tag => !existsTagsTiltes.includes(tag))
      .map(tag => ({ title: tag }));

    const createdTags = await Tag.create(newTagsData);
    const tagsIds = createdTags.map(tag => tag._id);

    parseCsv.on('data', async line => {
      const [email] = line;

      await Contact.findOneAndUpdate({ email }, { $addToset: { tags: tagsIds } }, { upsert: true })
    });

    await new Promise(resolve => parseCsv.on('end', resolve));
  }
}

export default ImportContactsService
