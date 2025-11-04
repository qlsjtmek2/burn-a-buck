# Martin Fowler's Refactoring Catalog

## Table of Contents

1. [Basic Refactorings](#basic-refactorings)
2. [Encapsulation](#encapsulation)
3. [Moving Features](#moving-features)
4. [Organizing Data](#organizing-data)
5. [Simplifying Conditional Logic](#simplifying-conditional-logic)
6. [Refactoring APIs](#refactoring-apis)
7. [Dealing with Inheritance](#dealing-with-inheritance)
8. [Advanced Refactorings](#advanced-refactorings)

---

## Basic Refactorings

These are the most frequently used refactoring techniques that every developer should master.

### Extract Function

**When to use:** Function is too long (>50 lines) or contains complex logic that can be named

**Mechanics:**
1. Create new function with intention-revealing name
2. Copy extracted code into new function
3. Replace old code with call to new function
4. Test

**Example:**
```typescript
// Before
function printOwing(invoice: Invoice) {
  printBanner();
  let outstanding = calculateOutstanding();

  // Print details
  console.log(`name: ${invoice.customer}`);
  console.log(`amount: ${outstanding}`);
}

// After
function printOwing(invoice: Invoice) {
  printBanner();
  let outstanding = calculateOutstanding();
  printDetails(invoice, outstanding);
}

function printDetails(invoice: Invoice, outstanding: number) {
  console.log(`name: ${invoice.customer}`);
  console.log(`amount: ${outstanding}`);
}
```

**Benefits:**
- Improves readability
- Enables reuse
- Clarifies intent through naming

---

### Inline Function

**When to use:** Function body is as clear as its name, or function is trivial

**Mechanics:**
1. Check function is not polymorphic
2. Find all callers
3. Replace calls with function body
4. Test after each replacement
5. Remove function definition

**Example:**
```typescript
// Before
function getRating(driver: Driver) {
  return moreThanFiveLateDeliveries(driver) ? 2 : 1;
}

function moreThanFiveLateDeliveries(driver: Driver) {
  return driver.numberOfLateDeliveries > 5;
}

// After
function getRating(driver: Driver) {
  return driver.numberOfLateDeliveries > 5 ? 2 : 1;
}
```

**Benefits:**
- Removes unnecessary indirection
- Simplifies code when abstraction doesn't add value

---

### Extract Variable

**When to use:** Complex expression is hard to understand

**Mechanics:**
1. Ensure expression has no side effects
2. Declare immutable variable
3. Replace expression with variable reference
4. Test

**Example:**
```typescript
// Before
return (
  order.quantity * order.itemPrice -
  Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
  Math.min(order.quantity * order.itemPrice * 0.1, 100)
);

// After
const basePrice = order.quantity * order.itemPrice;
const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
const shipping = Math.min(basePrice * 0.1, 100);
return basePrice - quantityDiscount + shipping;
```

**Benefits:**
- Makes complex expressions understandable
- Enables debugging (can inspect intermediate values)
- Documents intent through naming

---

### Inline Variable

**When to use:** Variable name doesn't communicate more than expression itself

**Example:**
```typescript
// Before
let basePrice = anOrder.basePrice;
return basePrice > 1000;

// After
return anOrder.basePrice > 1000;
```

---

### Change Function Declaration (Rename)

**When to use:** Function name doesn't reveal its purpose

**Mechanics:**
1. Choose better name
2. Update function declaration
3. Update all callers
4. Test

**Example:**
```typescript
// Before
function circum(radius: number) {
  return 2 * Math.PI * radius;
}

// After
function circumference(radius: number) {
  return 2 * Math.PI * radius;
}
```

**Good naming principles:**
- Use intention-revealing names
- Avoid abbreviations unless universally understood
- Function names should be verbs or verb phrases
- Variable names should be nouns or noun phrases

---

## Encapsulation

Encapsulation hides internal details and exposes only necessary interfaces.

### Encapsulate Variable

**When to use:** Variable is widely accessed and needs validation or change tracking

**Mechanics:**
1. Create getter and setter functions
2. Replace direct access with getter/setter
3. Limit visibility of variable
4. Test

**Example:**
```typescript
// Before
let defaultOwner = {firstName: "Martin", lastName: "Fowler"};

// Elsewhere
spaceship.owner = defaultOwner;
defaultOwner = {firstName: "Rebecca", lastName: "Parsons"};

// After
let defaultOwnerData = {firstName: "Martin", lastName: "Fowler"};

export function defaultOwner() {
  return defaultOwnerData;
}

export function setDefaultOwner(arg: Owner) {
  defaultOwnerData = arg;
}

// Elsewhere
spaceship.owner = defaultOwner();
setDefaultOwner({firstName: "Rebecca", lastName: "Parsons"});
```

**Benefits:**
- Monitors changes
- Validates new values
- Provides interception point for future changes

---

### Encapsulate Collection

**When to use:** Method returns collection that can be modified directly

**Mechanics:**
1. Create add/remove methods if not present
2. Return read-only proxy or copy
3. Update callers to use add/remove
4. Test

**Example:**
```typescript
// Before
class Person {
  private _courses: Course[];

  get courses() {
    return this._courses;
  }

  set courses(aList: Course[]) {
    this._courses = aList;
  }
}

// Callers can do:
person.courses.push(newCourse); // Bypasses encapsulation!

// After
class Person {
  private _courses: Course[];

  get courses() {
    return [...this._courses]; // Return copy
  }

  addCourse(course: Course) {
    this._courses.push(course);
  }

  removeCourse(course: Course) {
    const index = this._courses.indexOf(course);
    if (index === -1) throw new RangeError();
    this._courses.splice(index, 1);
  }
}
```

---

### Replace Primitive with Object

**When to use:** Primitive data element gains behavior

**Example:**
```typescript
// Before
class Order {
  constructor(public priority: string) {}
}

// After
class Order {
  constructor(public priority: Priority) {}
}

class Priority {
  private _value: string;
  private static _legalValues = ['low', 'normal', 'high', 'rush'];

  constructor(value: string) {
    if (!Priority._legalValues.includes(value)) {
      throw new Error(`${value} is invalid for Priority`);
    }
    this._value = value;
  }

  toString() {
    return this._value;
  }

  get index() {
    return Priority._legalValues.indexOf(this._value);
  }

  equals(other: Priority) {
    return this._value === other._value;
  }

  higherThan(other: Priority) {
    return this.index > other.index;
  }
}
```

**Benefits:**
- Encapsulates validation logic
- Provides type-safe operations
- Enables complex behavior on data

---

## Moving Features

Refactorings that move functionality between classes and modules.

### Move Function

**When to use:** Function references elements of another context more than its own

**Mechanics:**
1. Examine function's scope
2. Create new function in target context
3. Copy body and adjust references
4. Make old function delegate to new
5. Test
6. Inline old function or remove

**Example:**
```typescript
// Before
class Account {
  get overdraftCharge() {
    if (this.type.isPremium) {
      const baseCharge = 10;
      return baseCharge - (this.daysOverdrawn * 0.5);
    }
    return this.daysOverdrawn * 1.75;
  }
}

// After
class Account {
  get overdraftCharge() {
    return this.type.overdraftCharge(this);
  }
}

class AccountType {
  overdraftCharge(account: Account) {
    if (this.isPremium) {
      const baseCharge = 10;
      return baseCharge - (account.daysOverdrawn * 0.5);
    }
    return account.daysOverdrawn * 1.75;
  }
}
```

---

### Move Field

**When to use:** Field is used more by another class than its own

**Example:**
```typescript
// Before
class Customer {
  private _discountRate: number;
  get discountRate() { return this._discountRate; }
}

// After
class Customer {
  private _contract: CustomerContract;
  get discountRate() { return this._contract.discountRate; }
}

class CustomerContract {
  private _discountRate: number;
  get discountRate() { return this._discountRate; }
}
```

---

### Extract Class

**When to use:** Class is doing work of two or more classes

**Example:**
```typescript
// Before
class Person {
  name: string;
  officeAreaCode: string;
  officeNumber: string;

  get telephoneNumber() {
    return `(${this.officeAreaCode}) ${this.officeNumber}`;
  }
}

// After
class Person {
  name: string;
  private _telephoneNumber: TelephoneNumber;

  get telephoneNumber() {
    return this._telephoneNumber.toString();
  }
}

class TelephoneNumber {
  constructor(
    private areaCode: string,
    private number: string
  ) {}

  toString() {
    return `(${this.areaCode}) ${this.number}`;
  }
}
```

---

## Organizing Data

Refactorings that improve data structures.

### Split Variable

**When to use:** Variable is assigned more than once (excluding loop accumulators)

**Example:**
```typescript
// Before
let temp = 2 * (height + width);
console.log(temp);
temp = height * width;
console.log(temp);

// After
const perimeter = 2 * (height + width);
console.log(perimeter);
const area = height * width;
console.log(area);
```

---

### Rename Field

**When to use:** Field name doesn't reveal its purpose

**Example:**
```typescript
// Before
class Organization {
  name: string;
}

// After
class Organization {
  title: string; // More specific than 'name'
}
```

---

### Replace Derived Variable with Query

**When to use:** Mutable data can be calculated from other data

**Example:**
```typescript
// Before
class ProductionPlan {
  private _production: number;
  private _adjustments: Adjustment[];

  get production() { return this._production; }

  applyAdjustment(anAdjustment: Adjustment) {
    this._adjustments.push(anAdjustment);
    this._production += anAdjustment.amount;
  }
}

// After
class ProductionPlan {
  private _adjustments: Adjustment[];

  get production() {
    return this._adjustments
      .reduce((sum, a) => sum + a.amount, 0);
  }

  applyAdjustment(anAdjustment: Adjustment) {
    this._adjustments.push(anAdjustment);
  }
}
```

**Benefits:**
- Eliminates duplicate data
- Reduces state management complexity
- Makes code more maintainable

---

### Change Reference to Value

**When to use:** Reference object is small, immutable, and awkward to manage

**Example:**
```typescript
// Before (Reference)
class Product {
  applyDiscount(arg: number) {
    this._price.amount -= arg;
  }
}

// After (Value)
class Product {
  applyDiscount(arg: number) {
    this._price = new Money(this._price.amount - arg, this._price.currency);
  }
}

class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {}

  equals(other: Money) {
    return this.amount === other.amount
      && this.currency === other.currency;
  }
}
```

---

## Simplifying Conditional Logic

Refactorings that make conditional logic easier to understand.

### Decompose Conditional

**When to use:** Complex conditional (if-then-else) needs clarification

**Example:**
```typescript
// Before
if (date.before(SUMMER_START) || date.after(SUMMER_END)) {
  charge = quantity * winterRate + winterServiceCharge;
} else {
  charge = quantity * summerRate;
}

// After
if (isSummer(date)) {
  charge = summerCharge(quantity);
} else {
  charge = winterCharge(quantity);
}

function isSummer(date: Date) {
  return !date.before(SUMMER_START) && !date.after(SUMMER_END);
}

function summerCharge(quantity: number) {
  return quantity * summerRate;
}

function winterCharge(quantity: number) {
  return quantity * winterRate + winterServiceCharge;
}
```

---

### Consolidate Conditional Expression

**When to use:** Multiple checks lead to same result

**Example:**
```typescript
// Before
if (employee.seniority < 2) return 0;
if (employee.monthsDisabled > 12) return 0;
if (employee.isPartTime) return 0;

// After
if (isNotEligibleForDisability(employee)) return 0;

function isNotEligibleForDisability(employee: Employee) {
  return employee.seniority < 2
    || employee.monthsDisabled > 12
    || employee.isPartTime;
}
```

---

### Replace Nested Conditional with Guard Clauses

**When to use:** One path is normal behavior, others are special cases

**Example:**
```typescript
// Before
function getPayAmount(employee: Employee) {
  let result;
  if (employee.isSeparated) {
    result = {amount: 0, reasonCode: "SEP"};
  } else {
    if (employee.isRetired) {
      result = {amount: 0, reasonCode: "RET"};
    } else {
      // Normal case
      result = normalPayAmount(employee);
    }
  }
  return result;
}

// After (Guard Clauses)
function getPayAmount(employee: Employee) {
  if (employee.isSeparated) {
    return {amount: 0, reasonCode: "SEP"};
  }
  if (employee.isRetired) {
    return {amount: 0, reasonCode: "RET"};
  }
  return normalPayAmount(employee);
}
```

**Benefits:**
- Clarifies normal vs. special cases
- Reduces nesting
- Improves readability

---

### Replace Conditional with Polymorphism

**When to use:** Conditional behavior varies by type

**Example:**
```typescript
// Before
function plumage(bird: Bird) {
  switch (bird.type) {
    case 'EuropeanSwallow':
      return "average";
    case 'AfricanSwallow':
      return bird.numberOfCoconuts > 2 ? "tired" : "average";
    case 'NorwegianBlueParrot':
      return bird.voltage > 100 ? "scorched" : "beautiful";
    default:
      return "unknown";
  }
}

// After
class Bird {
  get plumage() { return "unknown"; }
}

class EuropeanSwallow extends Bird {
  get plumage() { return "average"; }
}

class AfricanSwallow extends Bird {
  get plumage() {
    return this.numberOfCoconuts > 2 ? "tired" : "average";
  }
}

class NorwegianBlueParrot extends Bird {
  get plumage() {
    return this.voltage > 100 ? "scorched" : "beautiful";
  }
}
```

---

## Refactoring APIs

Refactorings that improve interfaces.

### Separate Query from Modifier

**When to use:** Method returns value AND has side effects

**Example:**
```typescript
// Before
function getTotalOutstandingAndSendBill() {
  const result = customer.invoices.reduce((total, each) => total + each.amount, 0);
  sendBill();
  return result;
}

// After
function getTotalOutstanding() {
  return customer.invoices.reduce((total, each) => total + each.amount, 0);
}

function sendBill() {
  // Send bill logic
}
```

**Principle:** Command-Query Separation (CQS)
- **Query** - Returns value, no side effects
- **Command** - Has side effects, returns nothing

---

### Parameterize Function

**When to use:** Similar functions differ only by literal values

**Example:**
```typescript
// Before
function tenPercentRaise(person: Person) {
  person.salary = person.salary * 1.1;
}

function fivePercentRaise(person: Person) {
  person.salary = person.salary * 1.05;
}

// After
function raise(person: Person, factor: number) {
  person.salary = person.salary * (1 + factor);
}

// Usage
raise(person, 0.1);  // 10% raise
raise(person, 0.05); // 5% raise
```

---

### Replace Parameter with Query

**When to use:** Parameter can be determined from another parameter

**Example:**
```typescript
// Before
availableVacation(employee, employee.grade);

function availableVacation(employee: Employee, grade: number) {
  // Calculate vacation days based on grade
}

// After
availableVacation(employee);

function availableVacation(employee: Employee) {
  const grade = employee.grade;
  // Calculate vacation days
}
```

---

### Preserve Whole Object

**When to use:** Passing multiple values from same object

**Example:**
```typescript
// Before
const low = room.daysTempRange.low;
const high = room.daysTempRange.high;
if (!plan.withinRange(low, high)) {
  alerts.push("room temperature went outside range");
}

// After
if (!plan.withinRange(room.daysTempRange)) {
  alerts.push("room temperature went outside range");
}
```

---

### Introduce Parameter Object

**When to use:** Multiple parameters naturally go together

**Example:**
```typescript
// Before
function amountInvoiced(startDate: Date, endDate: Date) { ... }
function amountReceived(startDate: Date, endDate: Date) { ... }
function amountOverdue(startDate: Date, endDate: Date) { ... }

// After
class DateRange {
  constructor(
    public readonly start: Date,
    public readonly end: Date
  ) {}
}

function amountInvoiced(dateRange: DateRange) { ... }
function amountReceived(dateRange: DateRange) { ... }
function amountOverdue(dateRange: DateRange) { ... }
```

---

## Dealing with Inheritance

Refactorings for class hierarchies.

### Pull Up Method

**When to use:** Methods in subclasses do the same thing

**Example:**
```typescript
// Before
class Employee { }

class Salesman extends Employee {
  getName() { return this.name; }
}

class Engineer extends Employee {
  getName() { return this.name; }
}

// After
class Employee {
  getName() { return this.name; }
}

class Salesman extends Employee { }
class Engineer extends Employee { }
```

---

### Pull Up Field

**When to use:** Subclasses have same field

---

### Push Down Method

**When to use:** Method only relevant to some subclasses

**Example:**
```typescript
// Before
class Employee {
  getQuota() { ... } // Only relevant to salesmen
}

// After
class Employee { }

class Salesman extends Employee {
  getQuota() { ... }
}
```

---

### Replace Type Code with Subclasses

**When to use:** Type codes determine behavior

**Example:**
```typescript
// Before
class Employee {
  constructor(public name: string, public type: string) {}
}

// After
class Employee {
  constructor(public name: string) {}
}

class Engineer extends Employee {}
class Salesman extends Employee {}
class Manager extends Employee {}
```

---

## Advanced Refactorings

More complex refactorings for specific situations.

### Replace Loop with Pipeline

**When to use:** Using loops to process collections

**Example:**
```typescript
// Before
const names: string[] = [];
for (const person of people) {
  if (person.job === "programmer") {
    names.push(person.name);
  }
}

// After
const names = people
  .filter(p => p.job === "programmer")
  .map(p => p.name);
```

**Benefits:**
- More declarative
- Easier to understand intent
- Better composability

---

### Replace Function with Command

**When to use:** Function needs complex configuration or breakdown into methods

**Example:**
```typescript
// Before
function score(candidate: Candidate, medicalExam: MedicalExam, scoringGuide: ScoringGuide) {
  let result = 0;
  let healthLevel = 0;
  // Complex scoring logic (100+ lines)
  return result;
}

// After
class Scorer {
  constructor(
    private candidate: Candidate,
    private medicalExam: MedicalExam,
    private scoringGuide: ScoringGuide
  ) {}

  execute() {
    this.setupHealthLevel();
    let result = this.calculateBaseScore();
    result = this.applyHealthAdjustments(result);
    return result;
  }

  private setupHealthLevel() { ... }
  private calculateBaseScore() { ... }
  private applyHealthAdjustments(base: number) { ... }
}
```

---

### Split Phase

**When to use:** Code doing two different things in sequence

**Example:**
```typescript
// Before
function priceOrder(product: Product, quantity: number, shippingMethod: ShippingMethod) {
  const basePrice = product.basePrice * quantity;
  const discount = Math.max(quantity - product.discountThreshold, 0)
    * product.basePrice * product.discountRate;
  const shippingCost = calculateShippingCost(product, quantity, shippingMethod);
  return basePrice - discount + shippingCost;
}

// After (Two phases: Calculate pricing, then apply shipping)
function priceOrder(product: Product, quantity: number, shippingMethod: ShippingMethod) {
  const priceData = calculatePriceData(product, quantity);
  return applyShipping(priceData, shippingMethod);
}

function calculatePriceData(product: Product, quantity: number) {
  const basePrice = product.basePrice * quantity;
  const discount = Math.max(quantity - product.discountThreshold, 0)
    * product.basePrice * product.discountRate;
  return { basePrice, discount, quantity };
}

function applyShipping(priceData: PriceData, shippingMethod: ShippingMethod) {
  const shippingCost = calculateShippingCost(priceData, shippingMethod);
  return priceData.basePrice - priceData.discount + shippingCost;
}
```

---

## Quick Reference: When to Use Each Technique

| Code Smell | Refactoring Technique |
|-------------|----------------------|
| Long function (>50 lines) | Extract Function |
| Duplicate code | Extract Function, Pull Up Method |
| Long parameter list | Introduce Parameter Object, Preserve Whole Object |
| Feature envy (method uses another class more) | Move Function |
| Data clumps (same fields together) | Extract Class, Introduce Parameter Object |
| Primitive obsession | Replace Primitive with Object |
| Large class (>250 lines) | Extract Class, Extract Subclass |
| Divergent change (one class changed for different reasons) | Extract Class |
| Shotgun surgery (one change affects many classes) | Move Function, Move Field |
| Complex conditionals | Decompose Conditional, Replace Conditional with Polymorphism |
| Speculative generality (unused abstraction) | Inline Function, Inline Class |
| Temporary field (field only used sometimes) | Extract Class |
| Message chains (a.b().c().d()) | Hide Delegate |
| Middle man (class delegates everything) | Remove Middle Man |

---

## References

- **Refactoring: Improving the Design of Existing Code (2nd Edition)** by Martin Fowler
- **Online Catalog**: https://refactoring.com/catalog/
- **Refactoring.Guru**: https://refactoring.guru/refactoring/catalog

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-04
