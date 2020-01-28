import mongoose from 'mongoose';
import Contact from '@schemas/Contact';

describe('import', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('MongoDB server not initialized');
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  });

  // fecha a conexão com o mongo
  afterAll(async () => {
    await mongoose.connection.close()
  });

  //antes de caqda teste, deleta todos os dados do banco
  beforeEach(async () => {
    await Contact.deleteMany({});
  });

  it('should be able to import new contacts', async () => {
    await Contact.create({ email: 'andrevrcoelho@hotmail.com' });

    const list = await Contact.find({});

    expect(list).toEqual(expect.arrayContaining([
      expect.objectContaining({
        email: 'andrevrcoelho@hotmail.com'
      })
    ]))
  })
})
