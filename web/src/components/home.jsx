import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./home.css";
import {
  FormLabel, FormControl, Input, Button, Card, CardFooter, CardBody, Heading, Box, Flex,
  CardHeader, Image, Stack, Text, Divider, ButtonGroup, IconButton, InputGroup,
  InputLeftElement,
  InputRightAddon,
  Textarea
} from "@chakra-ui/react"
import { SearchIcon, Search2Icon } from "@chakra-ui/icons";

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


    } catch (error) {
      console.log(error);
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

  const searchHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/v1/search?q=${searchInputRef.current.value}`);
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
    <div className="maindiv">

      <div className="searchInput" >
        <form onSubmit={searchHandler} >
          <InputGroup borderRadius={5} size="sm">
            <Input  htmlSize="50" p="5" placeholder="Search..." ref={searchInputRef} border="1px solid #949494" />
            <InputRightAddon
              p={0}
              border="none"
            >
              <Button size="sm" p="0.5rem" borderLeftRadius={0} borderRightRadius={3.3} border="1px solid #949494">
                Search
          </Button>
            </InputRightAddon>
          </InputGroup>
        </form>
      </div>
      <div className="inputField">

        <Card maxW="lg" maxW="40rem !important" borderWidth="1px" borderRadius="5" overflow="hidden" p="1rem" m="6">

          <form onSubmit={submitHandler} className="input">

            <FormControl isRequired className="form" >
              <FormLabel fontWeight="bold" m="10" fontSize="20">Title</FormLabel>
              <Input placeholder='First name' borderWidth="1px" borderRadius="5" variant="flushed"
                htmlSize={62}
                width="auto" p="10" ref={postTitleInputRef} />
              <FormLabel fontWeight="bold" m="10" fontSize="20">Title</FormLabel>
              <Input required placeholder='Here is a sample' borderWidth="1px" borderRadius="5" variant="flushed"
                htmlSize={62}
                textAlign="left" p="10" type="text"
                width="auto" ref={postBodyInputRef} />
              <Button color="white" bgColor="teal" borderWidth="1px" borderRadius="5"
                p="10" marginTop="9" marginBottom="12" display="block" type="submit"> Submit Post </Button>
                {  alert && alert}
                {isLoading && "Loading..."}

            </FormControl>
          </form>
        </Card>



      </div>
      <div className="mid-col" >
        {allPosts.map((post, index) => (
          <div key={post._id} className="post">
            {post.isEdit ? (
              <form onSubmit={editSaveSubmitHandler} className="editForm">

            <FormControl isRequired  className="form" >
              <Input type="text" disabled value={post._id} hidden />
              <Input placeholder='First name' borderWidth="1px" borderRadius="5" variant="flushed"
                htmlSize={62}
                width="auto" p="10" defaultValue={post.title} />
                <br />
              <Textarea required placeholder='Here is a sample' borderWidth="1px" borderRadius="5" variant="flushed"
                htmlSize={62}
                textAlign="left" p="10" type="text"
                width="auto" defaultValue={post.text} ></Textarea>                <br />
                <Button borderWidth="1px" p="0.5rem" borderRadius="5" type="submit">Save</Button>
                <Button
                borderWidth="1px" p="0.5rem" borderRadius="5"
                type="button"
                onClick={() => {
                  post.isEdit = false;
                  setAllPosts([...allPosts]);
                }}
                >
                  Cancel
                </Button>
                  </FormControl>
              </form>
            ) : (

              <div>
                <Card maxW="lg" bgColor="white" maxW="40rem" borderWidth="1px" borderRadius="5" overflow="hidden" p="1rem" m="6">
                  <CardHeader>
                    <Flex>
                      <Box>
                        <Heading m="5" mb="0" as="h4" fontSize="20" size="lg">{post.title}</Heading>
                      </Box>
                    </Flex>
                  </CardHeader>
                  <CardBody paddingTop="15" m="5" mt="0" >
                    {post.text}
                  </CardBody>

                  <CardFooter
                    justify="left"
                    flexWrap="wrap"
                    paddingTop="10"
                    sx={{
                      "& > button": {
                        minW: "70px",
                      },
                    }}
                  >
                    <Button 
                    borderWidth="1px" borderRadius="5"
                    onClick={(e) => {
                      console.log("click");
                      allPosts[index].isEdit = true;
                      setAllPosts([...allPosts]);
                    }} variant="ghost" >
                      Edit
          </Button>
                    <Button
                    borderWidth="1px" borderRadius="5"
                     onClick={(e) => {
                      
                      deletePostHandler(post._id);
                    }} variant="ghost" >
                      Delete
          </Button>
                  </CardFooter>
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