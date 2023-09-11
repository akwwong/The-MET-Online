import React, { useState } from "react"
import { Container, Nav, Navbar, Form, Button, NavDropdown } from "react-bootstrap"
import Link from "next/link"
import { useRouter } from 'next/router'
import { useAtom } from "jotai"
import { searchHistoryAtom } from "@/store"
import { addToHistory } from "@/lib/userData"
import { readToken, removeToken } from "@/lib/authenticate"

export default function MainNav() {

    // useRouter hook
    const router = useRouter()

    // set an "isExpanded" value in the state, with a default value of false
    const [ isExpanded, setIsExpanded ] = useState(false)

    // searchHistory
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)

    // token
    let token = readToken()
    let userName = token ? token.userName : ''
    
    async function handleSubmit(event) {
        event.preventDefault()
        const searchField = `title=true&q=${event.target[0].value}`
        if (event.target[0].value) {
            router.push(`/artwork?${searchField}`)
        }
        setIsExpanded(false)
        setSearchHistory(await addToHistory(`title=true&q=${searchField}`))
    }

    // when the user clicks the <Navbar.Toggle> Component, toggle the "isExpanded" value (ie: if it's true, set it to false and vice versa) HINT: you can "toggle" a Boolean value in JS using someBoolean = !someBoolean
    const handleToggleNav = () => {
        setIsExpanded(!isExpanded)
    }

    // logout function
    const logout = () => {
        setIsExpanded(false)
        removeToken()
        router.push('/login')
    }

    return (
        <>
            <Navbar className="fixed-top navbar-dark bg-dark" expanded={isExpanded}>
                <Container>
                    <Navbar.Brand>Alex Wong</Navbar.Brand>
                    <Navbar.Toggle onClick={handleToggleNav} aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">

                    <Nav className="me-auto">
                        <Link href="/" passHref legacyBehavior><Nav.Link active={router.pathname === "/"}>Home</Nav.Link></Link>
                        <Link href="/search" passHref legacyBehavior><Nav.Link active={router.pathname === "/search"}>Advanced Search</Nav.Link></Link>
                    </Nav>

                    {/* search field handling */}
                    &nbsp;
                    <Form className="d-flex" onSubmit={handleSubmit}>
                        <Form.Control type="text" placeholder="Search" className="me-2"/>
                        <Button type="submit">Search</Button>
                    </Form>
                    &nbsp;
                    
                    <Nav>
                        <NavDropdown title={userName} id="basic-nav-dropdown">
                            <Link href="/favourites" passHref legacyBehavior>
                                <NavDropdown.Item active={router.pathname === "/favourites"} onClick={handleToggleNav}>
                                    Favourites
                                </NavDropdown.Item>
                            </Link>
                            
                            <Link href="/history" passHref legacyBehavior>
                                <NavDropdown.Item active={router.pathname === "/history"} onClick={handleToggleNav}>
                                    Search History
                                </NavDropdown.Item>
                            </Link>
                            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    {!token && (
                    <Nav>
                        <Link href="/register" passHref legacyBehavior>
                            <Nav.Link active={router.pathname === "/register"} onClick={() => setIsExpanded(false)}>Register</Nav.Link>
                        </Link>
                        <Link href="/login" passHref legacyBehavior>
                            <Nav.Link active={router.pathname === "/login"} onClick={() => setIsExpanded(false)}>Login</Nav.Link>
                        </Link>
                    </Nav>
                    )}
                    </Navbar.Collapse>
                </Container>    
            </Navbar>

            {/* Two line breaks */}
            <br /><br />  
        </>
    )
}