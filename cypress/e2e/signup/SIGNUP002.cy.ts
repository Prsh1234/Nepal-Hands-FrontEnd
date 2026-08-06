describe("SIGNUP002 - Valid registration", () => {
    it("should register a new user", () => {
      const email = `test${Date.now()}@example.com`;
  
      cy.visit("/auth");
      cy.contains("Sign Up").click();
  
      cy.get("#firstName").type("John");
      cy.get("#lastName").type("Doe");
      cy.get("#email").type(email);
      cy.get("#password").type("Password123");
  
      cy.contains("button", "Create Account").click();
  
      cy.url().should("include", "/profile");
  
      cy.window().then((win) => {
        expect(win.localStorage.getItem("AUTH_TOKEN")).to.not.be.null;
      });
    });
  });