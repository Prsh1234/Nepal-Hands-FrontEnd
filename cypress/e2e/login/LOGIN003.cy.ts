describe("LOGIN003 - Invalid password", () => {
  it("should not login with incorrect password", () => {
    cy.visit("/auth");

    cy.get("#email").type("test@example.com");
    cy.get("#password").type("WrongPass1");

    cy.get('button[type="submit"]').click();

    // User should remain on authentication page
    cy.url().should("include", "/auth");

    // Token should not be stored
    cy.window().then((win) => {
      expect(win.localStorage.getItem("AUTH_TOKEN")).to.be.null;
    });
  });
});