import React, { useState, useEffect, useContext } from 'react'

import ProfileContext from 'src/utils/ProfileContext'
import useMounted from 'src/hooks/useMounted'
import Wrapper from './Wrapper'
import Answer from './Answer'

export default function Step(props) {
  const { profile, setProfile, current, setCurrent, setComplete } = useContext(
    ProfileContext
  )

  const [answers, setAnswers] = useState([])

  const [fetching, setFetching] = useState(false)

  const mounted = useMounted()

  const [active, setActive] = useState(
    (!profile[props.step.name] && !current) || current === props.step.index
  )
  useEffect(() => {
    setActive(
      (!profile[props.step.name] && !current) || current === props.step.index
    )
  }, [profile, props.step, current])

  console.log(props.step, props.step.name)
  return (
    <Wrapper
      mounted={mounted}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()

        if (answers.length) {
          setFetching(true)
          setProfile({
            [props.step.name]: answers,
          }).then(() => {
            setFetching(false)
            if (props.last) {
              setComplete(true)
            }
          })
        }
      }}
    >
      <Wrapper.Label>
        {active ||
        !profile[props.step.name] ||
        profile[props.step.name][0] !== 'aucun'
          ? props.step.label[0]
          : props.step.label[1]}
        {!active ? (
          <Answer
            answers={profile[props.step.name]}
            options={props.step.options}
            onClick={() => setCurrent(props.step.index)}
          />
        ) : null}
      </Wrapper.Label>
      {active && (
        <>
          <Wrapper.Answers>
            {props.step.options.map((option) => (
              <Wrapper.Checkbox
                key={option.value}
                label={option.label}
                detail={option.detail}
                checked={answers.includes(option.value)}
                onChange={(checked) =>
                  setAnswers((prevAnswers) => {
                    if (option.value === 'aucun') {
                      return checked ? [option.value] : []
                    }
                    const tempAnswers = prevAnswers.filter(
                      (prevAnswer) =>
                        prevAnswer !== option.value && prevAnswer !== 'aucun'
                    )
                    return checked
                      ? [...tempAnswers, option.value]
                      : tempAnswers
                  })
                }
              />
            ))}
          </Wrapper.Answers>
          {props.step.detail && (
            <Wrapper.Detail
              dangerouslySetInnerHTML={{
                __html: props.step.detail,
              }}
            />
          )}
          <Wrapper.Submit disabled={!answers.length} fetching={fetching}>
            Valider
          </Wrapper.Submit>
        </>
      )}
    </Wrapper>
  )
}