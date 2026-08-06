
describe("LOGIN002 - Valid login", () => {
  it("should redirect to profile after successful login", () => {
    cy.visit("/auth");

    cy.get('input#email').type('admin@nepalHands.com')
    cy.get('input#password').type('Admin@123')

    cy.get('button[type="submit"]').click()

    cy.url().should("include", "/profile");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("AUTH_TOKEN")).to.not.be.null;
    });
  });
});