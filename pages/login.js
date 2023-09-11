import { Card, Form, Button, Alert } from "react-bootstrap"
import { useState } from 'react'
import { authenticateUser } from "../lib/authenticate"
import { useRouter } from 'next/router'
import { useAtom } from "jotai"

// import both the "getFavourites" and "getHistory" functions from our newly created "userData.js" file
import { getHistory, getFavourites } from "../lib/userData"

import { favouritesAtom } from "@/store"
import { searchHistoryAtom } from "@/store"

export default function Login(props){
    const router = useRouter()
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [warning, setWarning] = useState("")

    // reference both the "favouritesAtom" and the "searchHistoryAtom" using the "useAtom" hook (HINT: Be sure to include the corresponding import statements).
    const [history, setHistory] = useAtom(searchHistoryAtom)
    const [favourites, setFavourites] = useAtom(favouritesAtom)
    
    // create an "asynchronous" (async) function called "updateAtoms" within the "Login" component that updates both the favourites and history with the return values from the "getFavourites" and "getHistory" functions, ie:
    async function updateAtoms(){
        setFavourites(await getFavourites())
        setHistory(await getHistory())
    }
    
    async function handleSubmit(e) {
        e.preventDefault()
        try {
            await authenticateUser(user, password)
            await updateAtoms()
            router.push("/favourites")
        }
        catch(err){
            setWarning(err.message)
        }
    }
    
    return (
    <>
      <Card bg="light">
        <Card.Body><h2>Login</h2>
        Enter your login information below:
        </Card.Body>
      </Card>

      <br />

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>User:</Form.Label>
          <Form.Control type="text" value={user} id="userName" name="userName" onChange={e => setUser(e.target.value)} />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" value={password} id="password" name="password" onChange={e => setPassword(e.target.value)} />
        </Form.Group>

        {warning && <>
          <br />
          <Alert variant='danger'>
            {warning}
          </Alert>
        </>}

        <br />
        <Button variant="primary" className="pull-right" type="submit">Login</Button>
      </Form>
    </>
  )
}