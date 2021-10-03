import React, { useState } from 'react'

const Books = ({ booksList, show }) => {

  const [genre, setGenre] = useState('')

  if (!show) {
    return null
  }

  let books = booksList

  let temp = []
  for (const val of booksList) {
    temp.push(val.genres)
  }
  let allGenres = [...new Set(temp.flat())]

  let onlyBooksWithinGenre = booksList.filter(x => x.genres.includes(genre))

  return (
    <div>
      <h2>books</h2>
      {genre !== '' &&
        <div>in genre {genre}</div>
      }
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {genre === '' ?
            books.map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )
            :
            onlyBooksWithinGenre.map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )
          }
        </tbody>
      </table>
      <div>
        {allGenres.map(p =>
          <button key={p} onClick={() => setGenre(p)}>{p}</button>
        )}
        <button onClick={() => setGenre('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books