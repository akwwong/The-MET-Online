import React from "react"
import { Container, Row, Col, Card } from "react-bootstrap"
import { useAtom } from "jotai"
import { favouritesAtom } from "@/store"
import ArtworkCard from "@/components/ArtworkCard"

export default function Favourites() {

    // useAtom Hook
    const [favouritesList] = useAtom(favouritesAtom)
    
    if(!favouritesList) return null;

    // if the "favouritesList" is empty, a message must be shown to the user 
    if (favouritesList.length === 0) {
        return (
        <Card>
            <Card.Body>
                <Card.Title>Nothing Here</Card.Title>
                <Card.Text>Try adding some new artwork to the list.</Card.Text>
            </Card.Body>
        </Card>
        )
    }

    // if not empty, renders all of the items in the "favouritsList" in exactly the same way as the component in "/pages/artwork/index.js"
    return (
    <Container>
        <Row>
            {favouritesList.map((objectID) => (
            <Col key={objectID} lg={3}>
                <ArtworkCard objectID={objectID} />
            </Col>
            ))}
        </Row>
    </Container>
    )
}