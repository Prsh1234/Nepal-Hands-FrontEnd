describe("LOGIN001 - Login page loading", () => {
  it("should display the login form correctly", () => {
    cy.visit("/auth");

    cy.contains("Welcome back").should("be.visible");
    cy.contains("Sign In").should("be.visible");

    cy.get("#email").should("be.visible");
    cy.get("#password").should("be.visible");
    cy.contains("button", "Sign In").should("be.visible");
  });
});