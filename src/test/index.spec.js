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
  it('it should insert chat data to the database', (done) => {
    chai.request(server)
      .post('/api/v3/message')
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

  it('it should get all data from database', (done) => {
    chai.request(server)
      .get('/api/v3/messages')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.keys('status','message','data');
        expect(res.status).to.be.a('number');
        expect((res.body)).to.be.an('object');
        done(err);
      });
  });
  
});
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