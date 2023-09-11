import React, { useState, useEffect } from "react"
import useSWR from "swr"
import { useRouter } from "next/router"
import { Row, Col, Card, Pagination } from "react-bootstrap"
import Error from "next/error"
import ArtworkCard from "@/components/ArtworkCard"
import validObjectIDList from "@/public/data/validObjectIDList.json"

// declare a constant variable above your component function definition called PER_PAGE and set the value to 12
const PER_PAGE = 12

export default function Artwork() {

    // ensure that the following values are in the state: "artworkList" (no default value) and "page" (default value of 1)
    const [ artworkList, setArtworkList ] = useState(null)
    const [ page, setPage ] = useState(1)

    // use the "useRouter" hook to get the full value of the query string.  This can be accomplished using the following code:
    const router = useRouter()
    let finalQuery = router.asPath.split('?')[1]

    // use SWR to make a request where finalQuery is the value containing the full query string
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`)

    // declare two functions: previousPage() and nextPage() with logic to either decrease the value of page by 1 (if page > 1) or increase the value of page by 1 (if page < artworkList.length)
    const previousPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }
    
    const nextPage = () => {
        if (page < artworkList.length) {
            setPage(page + 1)
        }
    }

    // the data value (from SWR) is included in the dependency array (ie: [data])
    useEffect(() => {
        if (data) {

            // a5: we must use the "objectIDs" property from the "validObjectIDList" to help filter our search results (recall: this is the array containing over 480000 objectIDs)
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x))

            const results = []
            
            // you can use the "filteredResults" value in your loop to build the results array instead of data.objectIDs
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE)
                results.push(chunk)
            }

            setArtworkList(results)

            // set the page value in the state to 1
            setPage(1)
        }
    }, [data])
    
    // if an "error" occurs when making the SWR request
    if (error) {
        return <Error statusCode={404} />
    }
    
    // if the 'artworkList' state value is null / undefined
    if (!artworkList) {
        return null
    }
    
    return (
    <>
    {artworkList.length > 0 ? (
    <>
    <Row className="gy-4">
        {artworkList[page - 1].map((currentObjectID) => (
        <Col lg={3} key={currentObjectID}>
            <ArtworkCard objectID={currentObjectID} />
        </Col>
        ))}
    </Row>
    
    <Row>
        <Col>
        <br /><br />
        <Pagination>
            <Pagination.Prev onClick={previousPage} />
            <Pagination.Item>{page}</Pagination.Item>
            <Pagination.Next onClick={nextPage} />
        </Pagination>
        </Col>
    </Row>
    </>
    ) : (
    <Card>
        <Card.Body>
            <h4>Nothing Here</h4>
            Try searching for something else.
        </Card.Body>
    </Card>
    )}
    </>
    )
}
