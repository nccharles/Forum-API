import chai from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';
import server from '../index';
import db from "../database";
const { expect } = chai;
chai.use(chaiHttp);

describe('Testing endpoints', () => {
  it('it should insert first user to the database', (done) => {
    chai.request(server)
      .post('/api/v3/user')
      .send({
        username: 'charles',
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.keys('status','message','data');
        expect(res.status).to.be.a('number');
        expect((res.body)).to.be.an('object');
        expect((res.body.data.id)).to.be.a('number');
        expect((res.body.data.username)).to.be.a('string');
        done();
      });
  });
  it('it should insert second user to the database', (done) => {
    chai.request(server)
      .post('/api/v3/user')
      .send({
        username: 'veve',
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.keys('status','message','data');
        expect(res.status).to.be.a('number');
        expect((res.body)).to.be.an('object');
        expect((res.body.data.id)).to.be.a('number');
        expect((res.body.data.username)).to.be.a('string');
        done();
      });
  });
  it('it should insert room data to the database', (done) => {
    chai.request(server)
      .post('/api/v3/room/veve')
      .send({
        username: 'charles'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.keys('status','message','data');
        expect(res.status).to.be.a('number');
        expect((res.body)).to.be.an('object');
        expect((res.body.data.id)).to.be.a('number');
        expect((res.body.data.name)).to.be.a('string');
        expect((res.body.data.participants)).to.be.a('array');
        done();
      });
  });
  it('it should get room chats', (done) => {
    chai.request(server)
      .get('/api/v3/room/veve')
      .send({
        username: 'charles'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.keys('status','message','data');
        expect(res.status).to.be.a('number');
        expect((res.body)).to.be.an('object');
        expect((res.body.data.id)).to.be.a('number');
        expect((res.body.data.name)).to.be.a('string');
        expect((res.body.data.participants)).to.be.a('array');
        expect((res.body.data.chats)).to.be.a('array');
        done();
      });
  });
  it('it should get user rooms', (done) => {
    chai.request(server)
      .get('/api/v3/rooms')
      .send({
        username: 'charles'
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.keys('status','message','data');
        expect(res.status).to.be.a('number');
        expect((res.body)).to.be.an('object');
        expect((res.body.data[0].id)).to.be.a('number');
        expect((res.body.data[0].name)).to.be.a('string');
        expect((res.body.data[0].participants)).to.be.a('array');
        done();
      });
  });
  it('it should insert chat data to the database', (done) => {
    chai.request(server)
      .post('/api/v3/chat')
      .send({
        username: 'charles',
        text: 'Hello',
        room:1
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.keys('status','message','data');
        expect(res.status).to.be.a('number');
        expect((res.body)).to.be.an('object');
        expect((res.body.data.id)).to.be.a('number');
        expect((res.body.data.username)).to.be.a('string');
        expect((res.body.data.text)).to.be.a('string');
        done();
      });
  });

  it('it should get all forum chats from database', (done) => {
    chai.request(server)
      .get('/api/v3/chats')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.keys('status','message','data');
        expect(res.status).to.be.a('number');
        expect((res.body)).to.be.an('object');
        done(err);
      });
  });
  
});
describe('Testing Sockets function', () => {
  it('It should get all users',async (done) => {
      await db.getSocketUsers().then((result) => {
      expect(result).to.be.a('array');     
      }).then(done());
    
  })
  it('It should get all messages',async (done) => {
  await db.getSocketMessages().then((result) => {
      expect(result).to.be.a('object');     
      }).then(done());
  })
  it('It should create message',async (done) => {
      await db.createSocketMessage().then((result) => {
          expect(result).to.be.a('object');     
          }).then(done());
      })
  it('It should create user with username',async (done) => {
      await db.createSocketUser('kalisa').then((result) => {
          expect(result).to.be.a('object');     
          }).then(done());
      })
})
describe('Truncate tables', () => {
  it("It should truncate tables", done => {
   
    const queryText = "TRUNCATE users,chats,rooms RESTART IDENTITY";
    db.query(queryText)
      .then(response => {
          expect(response).to.be.an("array");
          expect(response.length).to.equal(0);
        done();
      })
      .catch(err => {
        done();
      });
  });
 
  })