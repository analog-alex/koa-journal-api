/*
 * container classes
 */

class Page {
  constructor(
        public index: number = 0,
        public size: number = 5,
        public totalPages: number = 1,
        public totalElements = 0,
    ) {}

  setCount(count: number) {
    this.totalElements = count;
    this.totalPages = Math.floor(count / this.size) + 1;
  }
}

class Pageable {
  constructor(
        public page: Page = new Page(),
        public embedded: any[]= [],
    ) {}
}

export { Page, Pageable };
