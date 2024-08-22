/* eslint-disable jsx-a11y/no-autofocus */
import React, { useEffect, useState } from 'react';
import type { Answers, Question } from '../../stores/dialogStore';
import useDialogStore from '../../stores/dialogStore';

import './index.scss';

function Dialog() {
  const { dialogs: [dialog] } = useDialogStore();

  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    setAnswers(dialog?.questions.reduce((acc, question: Question): Answers => ({
      ...acc,
      [question.id]: question.value || 0,
    }), {}) || {});
  }, [dialog]);

  if (!dialog) {
    return null;
  }

  return (
    <div className="dialog">
      <div className="dialog__backdrop" />
      <dialog className="dialog__content">
        { dialog.questions.map(({ id, message, min, max }, index) => (
          <label className="dialog__question" key={id}>
            <span className="dialog__question-text">{ message }</span>
            <input
              autoFocus={index === 0}
              className="dialog__question-input"
              type="number"
              min={min}
              max={max}
              value={answers[id] || 0}
              onChange={({ target: { value } }) => {
                setAnswers((currentAnswers) => ({
                  ...currentAnswers,
                  [id]: value,
                }));
              }}
            />
          </label>
        ))}
        <div className="dialog__buttons">
          <button
            type="button"
            className="dialog__button"
            onClick={() => {
              dialog.callback();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="dialog__button"
            onClick={() => {
              dialog.callback(answers);
            }}
          >
            Ok
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default Dialog;
