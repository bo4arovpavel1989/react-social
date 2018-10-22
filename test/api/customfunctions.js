const {describe, it} = require('mocha'),
  {expect} = require('chai'),
  customFunctions = require('../../api/customfunctions');

describe('setToken', ()=>{
  it('returns jwt based on response object data', ()=>{
    let response = {login:'login', pass:'pass', email:'email@mail.ru', secret:'secretstring'};
    const {setToken} = customFunctions;
    const result = setToken(response);
    expect(result).to.be.a('string');
  });
});
