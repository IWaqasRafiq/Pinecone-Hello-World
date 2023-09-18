import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Form, Card, Navbar, Container } from "react-bootstrap";
import { LuFileEdit } from "react-icons/lu";
import { MdDeleteForever } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import swal from "sweetalert";
import { Button } from "@chakra-ui/react";
// import Swal from 'sweetalert2'


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

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post(`${baseUrl}/api/v1/post`, {
        title: postTitleInputRef.current.value,
        text: postBodyInputRef.current.value,
      });
      swal({
        icon: "success",
        title: "Post Added",
        timer: 1000,
        setIsLoading:false
      });

    console.log("Response data:", response.data);

    // Log the current state of allPosts before updating it
    console.log("Before allPosts update:", allPosts);

    // Prepend the new post to the beginning of the allPosts array
    setAllPosts([response.data, ...allPosts]);

    // Log the updated state of allPosts
    console.log("After allPosts update:", allPosts);

    setAlert(response.data.message);
    setToggleRefresh(!toggleRefresh);

    e.target.reset();
    } catch (error) {
      // handle error
      console.log(error?.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPost();

    return () => {
      // cleanup function
    };
  }, [toggleRefresh]);

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
      })
     
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
    <div
      style={{
        backgroundColor: "#F8F9FA",
      }}
    >
      <Navbar expand="lg" fixed="top" className="bg-body navbar">
        <Container fluid className="navCon">
          <Navbar.Brand className="navText" href="#">
            Pinecone CRUD
          </Navbar.Brand>
          <Form className="d-flex" onSubmit={searchHandler}>
            <Form.Control
              ref={searchInputRef}
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button type="submit" variant="outline-success">
              Search
            </Button>
          </Form>
        </Container>
      </Navbar>
      <div
        style={{
          paddingTop: "2rem",
        }}
      >
        <Card
          style={{
            width: "50rem",
            marginTop: "5rem",
            marginLeft: "8rem",
            padding: "3rem",
            boxShadow: "1px 1px 5px #9E9E9E",
          }}
        >
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label
                style={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                Post Title
              </Form.Label>
              <Form.Control
                required
                minLength={6}
                maxLength={50}
                ref={postTitleInputRef}
                placeholder="Headings"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label
                style={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                Post Text
              </Form.Label>
              <Form.Control
                required
                minLength={2}
                maxLength={999}
                ref={postBodyInputRef}
                as="textarea"
                rows={3}
              />
            </Form.Group>
            <Button type="submit" style={{ marginRight: "15px" }} colorScheme='blue'>Publish Post</Button>
            <span>
              {alert && alert}
              {isLoading && (
                <Button
                  isLoading
                  loadingText="Processsing"
                  colorScheme="teal"
                  variant="outline"
                >
                  Submit
                </Button>
              )}
            </span>
          </Form>
        </Card>
      </div>

      <div>
        {allPosts.map((post, index) => (
          <div key={post._id} className="post">
            {post.isEdit ? (
              <Card
                style={{
                  width: "50rem",
                  marginTop: "5rem",
                  marginLeft: "8rem",
                  padding: "3rem",
                  boxShadow: "1px 1px 5px #9E9E9E",
                }}
              >
                <Form onSubmit={editSaveSubmitHandler}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Control
                      type="text"
                      disabled
                      value={post._id}
                      hidden
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Control type="text" defaultValue={post.title} />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Control
                      defaultValue={post.text}
                      type="text"
                      as="textarea"
                      rows={5}
                    />
                  </Form.Group>
                  <Button type="submit" colorScheme='blue' style={{ marginRight: "15px" }}>
                    Save
                  </Button>
                  <Button
                  colorScheme='blue'
                    type="button"
                    onClick={() => {
                      post.isEdit = false;
                      setAllPosts([...allPosts]);
                    }}
                  >
                    Cancel
                  </Button>
                </Form>
              </Card>
            ) : (
              <div>
                <Card
                  style={{
                    width: "50rem",
                    marginTop: "17px",
                    marginLeft: "8rem",
                  }}
                >
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>{post.text}</Card.Text>
                    <Button
                      style={{ marginRight: "15px"}}
                      colorScheme='blue'
                      onClick={(e) => {
                        console.log("click");
                        allPosts[index].isEdit = true;
                        setAllPosts([...allPosts]);
                      }}
                    >
                      <LuFileEdit
                      />
                      Edit
                    </Button>
                    <Button
                      colorScheme='red'
                      onClick={(e) => {
                        deletePostHandler(post._id);
                      }}
                    >
                      <MdDeleteForever
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
