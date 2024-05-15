class Response {
  constructor(status, message, data, relasiUrl, errors) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.links = relasiUrl;
  }
}

export default Response;
