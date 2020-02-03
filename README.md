**Selectors**

|                                        | API                                     | Example                                                      |
| -------------------------------------- | --------------------------------------- | ------------------------------------------------------------ |
| select by text                         | .contains(text)                         |                                                              |
| get url                                | cy.url()                                | ```cy.url().should( 'include', 'vacation.html')```           |
| get attribute value                    | .invoke('attrs', '<atr-name>')          | ```cy.get('.img-rounded').invoke('attr', 'src').should('include', 'assets/vacation.jpg')``` |
| get first element for query            | .first()                                | `cy.get('.brand').first().click()`                           |
| select by name                         | cy.get('[name="<value>"]')              | `cy.get('[name="toPort"]')`                                  |
| type and enter                         | type('todo A{enter}')                   | `cy.get('.new-todo').type('todo A{enter}')`                  |
| Click button that might not be visible | cy.get('button').click({ force: true }) |                                                              |

Trim and compare text : 
```
.should(($div) => {
    expect($div.text().trim()).equal('Skywalker,Anakin');
  })
```

Asset on text
```

```
**Assertions**

|                | API                        | Example                                                      |
| -------------- | -------------------------- | ------------------------------------------------------------ |
| contains text  | .should('include', 'text') | ```cy.url().should( 'include', 'vacation.html')```           |
| has text  | .should('have.text', '<value>') | ```cy.get("#name").should( 'have.text', 'vacation.html')```           |
| element exists | should('exist')            | ```cy.contains('Destination of the week: Hawaii !').should('exist')``` |
| element contains text |  `invoke('text').should('include', 'Travel')`                     |`cy.get('.brand').first().invoke('text').should('include', 'Travel'); `|

**Recipe**

- **Find children of parent of an element**

  ```js
  cy.get('td').contains('Lufthansa').parent().find('input[type="submit"]').as("bookThisFligh")
  ```

- **Get alement, make assertions and perform actions**

  ```js
  cy.get('td').contains('Lufthansa').parent().find('input[type="submit"]').as("bookThisFlight")
  cy.get("@bookThisFlight").invoke('attr', 'value').should('include', 'Choose This Flight')   cy.get("@bookThisFlight").click()
  ```

- get text

- ```javascript
  cy.get('.todo-list li')     // command
    .should('have.length', 2) // assertion
    .and(($li) => {
      // 2 more assertions
      expect($li.get(0).textContent, 'first item').to.equal('todo a')
      expect($li.get(1).textContent, 'second item').to.equal('todo B')
    })
  ```




All input commands 

- [`.click()`](https://docs.cypress.io/api/commands/click.html)

- [`.dblclick()`](https://docs.cypress.io/api/commands/dblclick.html)

- [`.type()`](https://docs.cypress.io/api/commands/type.html)

- [`.clear()`](https://docs.cypress.io/api/commands/clear.html)

- [`.check()`](https://docs.cypress.io/api/commands/check.html)

- [`.uncheck()`](https://docs.cypress.io/api/commands/uncheck.html)

- [`.select()`](https://docs.cypress.io/api/commands/select.html)

- [`.trigger()`](https://docs.cypress.io/api/commands/trigger.html)

- Prior to issuing any of the commands, we check the current state of the DOM and take some actions to ensure the DOM element is “ready” to receive the action.

- **Non actionable items**: e.g links hidden until we hover over its parents, to bypass such conditions use 

  ```
  cy.get('button').click({ force: true })
  ```

  

# Under the hood

- **Retryability** 

  - commands like `cy.get()`, `cy.contains()` and `cy.find()`  have a timeout

  - this timeout is 4 seconds by default (cypress 3)

  - overriden with [`defaultCommandTimeout`](https://docs.cypress.io/guides/references/configuration.html#Timeouts) configuration

  - and assetion fails, it keeps requering the DOM and trying again till the assetion passes

  - while assetsion are failing, it shows the assetion step as blue in UI : 
  <!--
    ![Retrying finding 2 items](/Users/dawn/Documents/projects/cypress-hello/docs/images/retryablity.gif)
  -->
    
  - As shown in above example, the assetions is in blue, indicating it is still retrying

  - It hte assetion does not pass in the `cy.get`'s timeout, it becomes a failed assetion (marked in red)

  - commands like `cy.click` **DO NOT** retry, because they can change the state of app

  - Only last command is retried, this can cause issue e.g. in [below case](https://docs.cypress.io/guides/core-concepts/retry-ability.html#Only-the-last-command-is-retried) : 

    ```javascript
    cy.get('.new-todo').type('todo B{enter}')
    cy.get('.todo-list li')         // queries immediately, finds 1 <li>
      .find('label')                // retried, retried, retried with 1 <li>
      .should('contain', 'todo B')  // never succeeds with only 1st <li>
    ```

- **Merging queries** 

  - to avoid such problems of retrybiliyt (where non-previous command can affect the result)

  - use merged queries

    ```javascript
    // This works
    cy.get('.todo-list li label')   // 1 query command (retried till timeout)
    .should('contain', 'todo B')  // assertion
    
        
    // This fails at times
    cy.get('.todo-list li')         // never retried, next command runs on result of this
      .find('label')                // retried, retried, retried with 1 <li>
      .should('contain', 'todo B')  // never succeeds with only 1st <li>
      
    // this works too
      cy.get('.todo-list li')         // retried till 2 elements are found
        .should('have.length', 2)     // assertion
        .find('label')                // command
        .should('contain', 'todo B')  // assertion
    ```

    

- **Commands vs assertions**

  - There are two type of methods

    - Commands
    - Assetions
    
    ```javascript
    it('creates 2 items', function () {
      cy.visit('/')                       // command
      cy.focused()                        // command
        .should('have.class', 'new-todo') // assertion
      cy.get('.new-todo')                 // command
        .type('todo A{enter}')            // command
        .type('todo B{enter}')            // command
      cy.get('.todo-list li')             // command
      .should('have.length', 2)         // assertion
    })
    ```
  
  - While running tests, cypress clearly indicates all commands and assertions executed in different UI styles

![image-20190804124935991](/Users/dawn/Documents/projects/cypress-hello/docs/images/command-vs-assertions.png)



- **Mulitple assertions**
  - when a command is chained with multiple assertions, 
  - it retries till first ascension, when it passes
  - it runs first assertion again with second till it passes
  - and then runts 1, 2 with 3 till three passes.
- 
