describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/auth')
    cy.get('input#email').type('admin@nepalHands.com')
    cy.get('input#password').type('Admin@123')
    cy.get('button[type="submit"]').click()
  })
})