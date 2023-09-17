import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Form, Card, Button, Navbar, Container } from "react-bootstrap";
import { LuFileEdit } from "react-icons/lu";
import { MdDeleteForever } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";

import "./home.css";

const baseUrl = "http://localhost:5501";

const Home = () => {
  const postTitleInputRef = useRef(null);
  const postBodyInputRef = useRef(null);
  const searchInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [toggleRefresh, setToggleRefresh] = useState(false);

  const getAllPost = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/v1/posts`);
      console.log(response.data);

      setIsLoading(false);
      setAllPosts([...response.data]);
      setAlert(response?.data?.message);
    } catch (error) {
      console.log(error.data);
      setIsLoading(false);
      setAlert(error.data.message); // Update the alert state with the error message
    }
  };

  const searchHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseUrl}/api/v1/search?q=${searchInputRef.current.value}`
      );
      console.log(response.data);

      setIsLoading(false);
      setAllPosts([...response.data]);
    } catch (error) {
      console.log(error.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPost();

    return () => {
      // cleanup function
    };
  }, [toggleRefresh]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post(`${baseUrl}/api/v1/post`, {
        title: postTitleInputRef.current.value,
        text: postBodyInputRef.current.value,
      });

      setIsLoading(false);
      console.log(response.data);
      setAlert(response.data.message);
      setToggleRefresh(!toggleRefresh);
      e.target.reset();
      // getAllPost();
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
    }
  };

  const deletePostHandler = async (_id) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${baseUrl}/api/v1/post/${_id}`, {
        title: postTitleInputRef.current.value,
        text: postBodyInputRef.current.value,
      });

      setIsLoading(false);
      console.log(response.data);
      setAlert(response.data.message);
      setToggleRefresh(!toggleRefresh);
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
    }
  };

  const editSaveSubmitHandler = async (e) => {
    e.preventDefault();
    const _id = e.target.elements[0].value;
    const title = e.target.elements[1].value;
    const text = e.target.elements[2].value;

    try {
      setIsLoading(true);
      const response = await axios.put(`${baseUrl}/api/v1/post/${_id}`, {
        title: title,
        text: text,
      });

      setIsLoading(false);
      console.log(response.data);
      setAlert(response?.data?.message);
      setToggleRefresh(!toggleRefresh);
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={searchHandler}>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="#">Pinecone CRUD</Navbar.Brand>
            <Form className="d-flex">
              <Form.Control
                ref={searchInputRef}
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button type="submit" variant="outline-success">Search</Button>
            </Form>
          </Container>
        </Navbar>
      </Form>
      <Form
        onSubmit={submitHandler}
        style={{ width: "40rem", marginLeft: "8rem" }}
      >
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Post Title</Form.Label>
          <Form.Control
            type="text"
            required
            minLength={6}
            maxLength={50}
            ref={postTitleInputRef}
            placeholder="Headings"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Post Text</Form.Label>
          <Form.Control
            required
            minLength={2}
            maxLength={999}
            ref={postBodyInputRef}
            as="textarea"
            rows={3}
          />
        </Form.Group>
        <button type="submit">Publish Post</button>
        <span>
          {alert && <p>{alert}</p>}
          {isLoading && "Loading..."}
        </span>
      </Form>

      <div>
        {allPosts.map((post, index) => (
          <div key={post._id} className="post">
            {post.isEdit ? (
              <form onSubmit={editSaveSubmitHandler} className="editForm">
                <input type="text" disabled value={post._id} hidden />
                <input
                  defaultValue={post.title}
                  type="text"
                  placeholder="title"
                />
                <br />
                <textarea
                  defaultValue={post.text}
                  type="text"
                  placeholder="body"
                />
                <br />
                <button type="submit">Save</button>
                <button
                  type="button"
                  onClick={() => {
                    post.isEdit = false;
                    setAllPosts([...allPosts]);
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <Card
                  style={{
                    width: "40rem",
                    marginTop: "10px",
                    marginLeft: "8rem",
                  }}
                >
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>{post.text}</Card.Text>
                    <Button
                      style={{ marginRight: "15px" }}
                      variant="primary"
                      onClick={(e) => {
                        console.log("click");
                        allPosts[index].isEdit = true;
                        setAllPosts([...allPosts]);
                      }}
                    >
                      <LuFileEdit
                        style={{
                          display: "inline",
                          marginBottom: "4px",
                          marginRight: "4px",
                        }}
                      />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={(e) => {
                        deletePostHandler(post._id);
                      }}
                    >
                      <MdDeleteForever
                        style={{
                          display: "inline",
                          marginBottom: "4px",
                          marginRight: "4px",
                        }}
                      />
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            )}
          </div>
        ))}

        <br />
      </div>
    </div>
  );
};

export default Home;
