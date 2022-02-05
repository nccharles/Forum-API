import chai from 'chai';
import fmsg from '../utils/message'
const { expect } = chai;

describe('users function', () => {
    it('It should format message ',(done) => {
        let result = fmsg('charles','Hello')
        expect(result).to.be.a('object'); 
        done();    
    })
})
