describe('test scroll bug', () => {
  it('should scroll to element and take screenshot', () => {
    cy.visit('http://127.0.0.1:8085');
    cy.get('#footer').scrollIntoView();
    cy.screenshot({capture: 'viewport'})
  })
});
