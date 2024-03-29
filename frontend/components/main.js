import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import groupBy from 'lodash.groupby'
import {
  categories,
  findCategory,
  services,
  getDefinitionsForCategory,
} from '../lib/service-definitions'
import ServiceDefinitionSetHelper from '../lib/service-definitions/service-definition-set-helper'
import { baseUrl } from '../constants'
import Meta from './meta'
import Header from './header'
import SuggestionAndSearch from './suggestion-and-search'
import DonateBox from './donate'
import MarkupModal from './markup-modal'
import Usage from './usage'
import Footer from './footer'
import {
  CategoryHeading,
  CategoryHeadings,
  CategoryNav,
} from './category-headings'
import BadgeExamples from './badge-examples'
import { BaseFont, GlobalStyle } from './common'

const AppContainer = styled(BaseFont)`
  text-align: center;
`

export default function Main({ pageContext }) {
  const [searchIsInProgress, setSearchIsInProgress] = useState(false)
  const [queryIsTooShort, setQueryIsTooShort] = useState(false)
  const [searchResults, setSearchResults] = useState()
  const [selectedExample, setSelectedExample] = useState()
  const searchTimeout = useRef(0)

  function performSearch(query) {
    setSearchIsInProgress(false)

    setQueryIsTooShort(query.length === 1)

    if (query.length >= 2) {
      const flat = ServiceDefinitionSetHelper.create(services)
        .notDeprecated()
        .search(query)
        .toArray()
      setSearchResults(groupBy(flat, 'category'))
    } else {
      setSearchResults(undefined)
    }
  }

  function searchQueryChanged(query) {
    /*
    Add a small delay before showing search results
    so that we wait until the user has stopped typing
    before we start loading stuff.

    This
    a) reduces the amount of badges we will load and
    b) stops the page from 'flashing' as the user types, like this:
    https://user-images.githubusercontent.com/7288322/42600206-9b278470-85b5-11e8-9f63-eb4a0c31cb4a.gif
    */
    setSearchIsInProgress(true)
    window.clearTimeout(searchTimeout.current)
    searchTimeout.current = window.setTimeout(() => performSearch(query), 500)
  }

  function dismissMarkupModal() {
    setSelectedExample(undefined)
  }

  function Category({ category, definitions }) {
    const flattened = definitions
      .reduce((accum, current) => {
        const { examples } = current
        return accum.concat(examples)
      }, [])
      .map(({ title, link, example, preview, documentation }) => ({
        title,
        link,
        example,
        preview,
        documentation,
      }))

    return (
      <div>
        <CategoryHeading category={category} />
        <BadgeExamples
          baseUrl={baseUrl}
          examples={flattened}
          onClick={setSelectedExample}
        />
      </div>
    )
  }
  Category.propTypes = {
    category: PropTypes.string.isRequired,
    definitions: PropTypes.array.isRequired,
  }

  function renderMain() {
    const { category } = pageContext

    if (searchIsInProgress) {
      return <div>searching...</div>
    } else if (queryIsTooShort) {
      return <div>Search term must have 2 or more characters</div>
    } else if (searchResults) {
      return Object.entries(searchResults).map(([categoryId, definitions]) => (
        <Category
          category={findCategory(categoryId)}
          definitions={definitions}
          key={categoryId}
        />
      ))
    } else if (category) {
      const definitions = ServiceDefinitionSetHelper.create(
        getDefinitionsForCategory(category.id)
      )
        .notDeprecated()
        .toArray()
      return (
        <div>
          <CategoryNav categories={categories} />
          <Category
            category={category}
            definitions={definitions}
            key={category.id}
          />
        </div>
      )
    } else {
      return <CategoryHeadings categories={categories} />
    }
  }

  return (
    <AppContainer id="app">
      <GlobalStyle />
      <Meta />
      <Header />
      <MarkupModal
        baseUrl={baseUrl}
        example={selectedExample}
        onRequestClose={dismissMarkupModal}
      />
      <section>
        <SuggestionAndSearch
          baseUrl={baseUrl}
          onBadgeClick={setSelectedExample}
          queryChanged={searchQueryChanged}
        />
        <DonateBox />
      </section>
      {renderMain()}
      <Usage baseUrl={baseUrl} />
      <Footer baseUrl={baseUrl} />
    </AppContainer>
  )
}

Main.propTypes = {
  // `pageContext` is the `context` passed to `createPage()` in
  // `gatsby-node.js`. In the case of the index page, `pageContext` is empty.
  pageContext: {
    category: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }.isRequired,
}
