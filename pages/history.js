import React from "react"
import { useAtom } from "jotai"
import { searchHistoryAtom } from "@/store"
import { useRouter } from "next/router"
import { Button, Card, ListGroup } from "react-bootstrap"
import styles from "@/styles/History.module.css"
import { removeFromHistory } from "@/lib/userData"

export default function History() {

    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    const router = useRouter()

    if(!searchHistory) return null

    let parsedHistory = []
    
    searchHistory.forEach((h) => {
        const params = new URLSearchParams(h)
        const entries = params.entries()
        parsedHistory.push(Object.fromEntries(entries))
    })
    
    // this function must cause the user to navigate (using the "useRouter" hook) to the page /artwork?searchHistory[index]

    const historyClicked = (e, index) => {
        e.stopPropagation() // stop the event from trigging other events
        router.push(`/artwork?${searchHistory[index]}`)
    }
    
    // the purpose of this function is to remove an element from the "searchHistory" list
    async function removeHistoryClicked (e, index) {
        e.stopPropagation() // stop the event from trigging other events
        setSearchHistory(await removeFromHistory(searchHistory[index]))
    }
    
    // check if parsedHistory.length == 0, render a message if so, otherwise display search history
    return (
    <>
    {parsedHistory.length ? (

        <ListGroup>
        {parsedHistory.map((historyItem, index) => (
        <ListGroup.Item onClick={(e) => historyClicked(e, index)} className={styles.historyListItem} key={index}>

            {Object.keys(historyItem).map((key) => (
            <>
                {key}: <strong>{historyItem[key]}</strong>&nbsp;
            </>
            ))}
            
            <Button className="float-end" variant="danger" size="sm" onClick={(e) => removeHistoryClicked(e, index)}>&times;</Button>

        </ListGroup.Item>
        ))}
        </ListGroup>
    ) 
    :
    (
        <Card>
            <Card.Body>
                <Card.Title>Nothing Here</Card.Title>
                <Card.Text>Try searching for some artwork.</Card.Text>
            </Card.Body>
        </Card>
    )}
    </>
    )
}