import React, { useState, useEffect } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Card, Button } from "react-bootstrap"
import Error from "next/error"
import { useAtom } from "jotai"
import { favouritesAtom } from "@/store"
import { addToFavourites, removeFromFavourites } from "@/lib/userData"

const fetchedURL = (url) => fetch(url).then((res) => res.json())

export default function ArtworkCard(props) {

    // get a reference to the "favouritesList" from the "favouritesAtom" (HINT:  this can be done using the "useAtom" hook)
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom)

    // add a "showAdded" value to the state (this will control how the button (defined below) is displayed) with a default value of true if the "favouritesList" includes the objectID (passed in "props") and false if it does not
    const [showAdded, setShowAdded] = useState(false)
    
    // uses SWR to make a request where objectID is the value of the "objectID" prop
    const { data, error } = useSWR(props.objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${props.objectID}` : null, fetchedURL)

    // use the React "useEffect" hook to update showAdded instead
    useEffect(() => {
        setShowAdded(favouritesList?.includes(props.objectID))
    }, [favouritesList])
    
    // if request fails, render the "Error" component from "next/error", ie: <Error statusCode={404} 
    if (error) {
        return <Error statusCode={404} />
    }
    
    // checks if there is data, otherwise return null
    if (!data) {
        return null
    }

    const { primaryImage, primaryImageSmall, title, objectDate, classification, medium, artistDisplayName, creditLine, dimensions, artistWikidata_URL } = data

    async function favouritesClicked() {
        if (showAdded) {
            // if showAdded is true (ie: it is in the favourites list), set the favourites list 
            setFavouritesList(await removeFromFavourites(props.objectID))
            setShowAdded(false)
        } else {
            // if showAdded is false (ie: it is not in the favourites list), set the favourites list by invoking:
            setFavouritesList(await addToFavourites(props.objectID))
            setShowAdded(true)
        }
    }

    return (
    <Card>
        {/* renders the primaryImage property if it is returned */}
        {primaryImage && <Card.Img variant="top" src={primaryImage} />}
        
        <Card.Body>

            {/* renders the title property.  If there is no title property, render "N/A" */}
            <Card.Title>{title || "N/A"}</Card.Title>
            
            {/* renders objectDate, classification and medium properties.  If any of these missing, render "N/A" in their place. */}
            <Card.Text>
                <b>Date:</b> {objectDate || "N/A"}
                <br />
                <b>Classification:</b> {classification || "N/A"}
                <br />
                <b>Medium:</b> {medium || "N/A"}
                <br />
                <br />

                {/* the following properties are also rendered: artistDisplayName, creditLine and dimensions */}
                <b>Artist: </b> {artistDisplayName || "N/A"} ({artistDisplayName && (<a href={artistWikidata_URL} target="_blank" rel="noreferrer">wiki</a>)})
                <br />
                <b>Credit Line: </b> {creditLine || "N/A"}
                <br />
                <b>Dimensions: </b> {dimensions || "N/A"}
                <br />
            </Card.Text>

            <Link href={`/artwork/${props.objectID}`} passHref>
                <Button variant="primary">
                    <b>ID: </b>
                    {props.objectID}
                </Button>
            </Link>

            <Button variant={showAdded ? "primary" : "outline-primary"} onClick={favouritesClicked}>{showAdded ? "+ Favourite (added)" : "+ Favourite"}</Button>

        </Card.Body>
    </Card>
    )
}