const sinon = require('sinon'),
  {describe, it} = require('mocha'),
  {expect} = require('chai'),
  easyimg = require('easyimage'),
  customFunctions = require('../../api/customfunctions'),
  db = require('../../api/dbqueries')

describe('setToken', ()=>{
  it('returns jwt based on response object data', ()=>{
    let response = {login:'login', pass:'pass', email:'email@mail.ru', secret:'secretstring'};
    const {setToken} = customFunctions;
    const result = setToken(response);
    expect(result).to.be.a('string');
  });
});

describe('authService', ()=>{

  beforeEach(function () {
      this.sandbox = sinon.createSandbox()
  })

  afterEach(function () {
      this.sandbox.restore()
  })

  const {authService} = customFunctions;

  it('should return promise with token data if correct', function * () {
    const cred = {login:'login', passwd:'pass'};
    const query = {loginUpperCase:cred.login.toUpperCase(), passwd:cred.pass}
    const dbStub = this.sandbox.stub(db, 'findOne', (q, cb) => {
      cb({auth:true, id:'id', login:'login', token:'token'});
    });

    const result = yield authService.login(cred);

    expect(dbStub).to().be().calledWith(query);
    expect(result).to().eql({auth:true, id:'id', login:'login', token:'token'})
  })
});

describe('make resize', ()=>{
  const {makeResize} = customFunctions;

  beforeEach( function() {
       this.easyImgStub = sinon.stub(easyimg, 'resize');
   });

   afterEach( function() {;
       this.easyImgStub.restore();
   });

  it('should callbak true when resized', function * (){
    this.easyImgStub.returns(true);
    expect(makeResize).to().eql(true);
  });
});
