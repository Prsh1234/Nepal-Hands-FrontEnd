describe("LOGIN005 - Protected route without login", () => {
    it("should redirect to auth page", () => {
      cy.clearLocalStorage();
      cy.clearCookies();
  
      cy.visit("/profile");
  
      cy.url().should("include", "/auth");
    });
  });