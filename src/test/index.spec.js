import chai from 'chai';
import chaiHttp from 'chai-http';
import 'dotenv/config';
import server from '../index';
import db from "../database";
const { expect } = chai;
chai.use(chaiHttp);
describe('Testing endpoints', () => {
  it('it should insert user data to the database', (done) => {
    chai.request(server)
      .post('/api/v3/user')
      .send({
        username: 'Charles',
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
  it('it should insert chat data to the database', (done) => {
    chai.request(server)
      .post('/api/v3/message')
      .send({
        username: 'charles',
        text: 'Hello'
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
        done();
      });
  });
  
  it("It should truncate users table", done => {
    const queryText = "TRUNCATE users CASCADE";
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
  it("It should truncate chats table", done => {
    const queryText = "TRUNCATE chats CASCADE";
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
});