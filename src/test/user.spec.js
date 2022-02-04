import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../database'
import user from '../utils/users'
import fmsg from '../utils/message'
const { expect,should } = chai;

describe('users function', () => {
    it('It should get user with room',(done) => {
        let result = user.userJoin({id:1,username:'charles'},'dev')
        expect(result).to.be.a('object'); 
        expect(result).to.have.a.property('id').equal(1);
        expect(result).to.have.a.property('username').equal('charles');
        expect(result).to.have.a.property('room').equal('dev');
        done();    
    })
      
    it('It should get current user ',(done) => {
        let result = user.getCurrentUser('charles')
        expect(result).to.be.a('object'); 
        done();    
    })
        
    it('It should get room users ',(done) => {
        let result = user.getRoomUsers('dev')
        expect(result).to.be.a('array'); 
        done();    
    })
    it('It should check user leaves ',(done) => {
        let result = user.userLeave('charles')
        expect(result).to.be.a('object'); 
        expect(result).to.have.a.property('id').equal(1);
        expect(result).to.have.a.property('username').equal('charles');
        expect(result).to.have.a.property('room').equal('dev');
        done();    
    })
    it('It should format message ',(done) => {
        let result = fmsg('charles','Hello')
        expect(result).to.be.a('object'); 
        done();    
    })
})
