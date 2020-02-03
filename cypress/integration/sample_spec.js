describe('Selectors and assertions', () => {
  it('should scroll to element and take screenshot', () => {
    cy.visit('http://127.0.0.1:8080');
    cy.get('#footer').scrollIntoView();
    cy.screenshot({capture: 'viewport'})
  })
});
