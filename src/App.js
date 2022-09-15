import React, { Component } from "react";
import Media from "react-bootstrap/Media";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import underscore from "underscore";
import axios from "axios";
import "./App.css";

const prodUrl = "http://ec2-52-70-122-182.compute-1.amazonaws.com:3001";
//const devUrl = "http://localhost:3001";

function App() {
  return (
    <div className="App">
      <h1>Indie Books!</h1>
      <AdditionForm />
      <BookList />
    </div>
  );
}

class AdditionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: true
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const goodreadsUrl = new FormData(event.target).get("goodreadsLink");

    var regex = RegExp("^.*goodreads\\.com\\/book\\/show\\/\\d+.*");
    if (regex.test(goodreadsUrl)) {
      var str = goodreadsUrl;
      var reg = new RegExp("\\d+");
      var matches = str.match(reg);
      axios({
        method: "post",
        url: prodUrl + "/addbook",
        data: {
          bookId: goodreadsUrl.slice(
            matches.index,
            matches.index + matches[0].length
          )
        }
      });
      this.setState({
        validated: true
      });
    } else {
      this.setState({
        validated: false
      });
    }
  }

  getForm() {
    const { validated } = this.state;
    const error = validated ? (
      <div />
    ) : (
      <Col>
        {" "}
        That was not a valid goodreads book link. Example goodreads link is:
        https://www.goodreads.com/book/show/386162.The_Hitchhiker_s_Guide_to_the_Galaxy
      </Col>
    );
    return (
      <Form onSubmit={event => this.handleSubmit(event)}>
        <Form.Row>
          <Col>
            <Form.Control
              type="text"
              name="goodreadsLink"
              placeholder="Enter goodreads link to suggest a book!"
            />
          </Col>
          {error}
          <Col>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }

  render() {
    const innerContents = this.getForm();

    return <div className="newBo