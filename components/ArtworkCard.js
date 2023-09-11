import React from "react"
import useSWR from "swr"
import Link from "next/link"
import { Card, Button } from "react-bootstrap"
import Error from "next/error"

export default function ArtworkCard({ objectID }) {
    
    // uses SWR to make a request where objectID is the value of the "objectID" prop
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
    
    // if request fails, render the "Error" component from "next/error", ie: <Error statusCode={404} 
    if (error) {
        return <Error statusCode={404} />
    }
    
    // checks if there is data, otherwise return null
    if (!data) {
        return null
    }

  const { primaryImageSmall, title, objectDate, classification, medium } = data

  return (
    <Card>
        {/* renders the primaryImageSmall property */}
        <Card.Img variant="top" src={primaryImageSmall || "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"}/>
        
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
            </Card.Text>

            <Link href={`/artwork/${objectID}`} passHref>
                <Button variant="primary">
                    <b>ID: </b>
                    {objectID}
                </Button>
            </Link>

        </Card.Body>
    </Card>
    )
}
