import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

const { div, button, input, ul, li } = hh(h);

const MSGS = {
  TEXT_EINGABE: "TEXT_EINGABE",
  EINGABE_SPEICHERN: "EINGABE_SPEICHERN",
  EINGABE_ENTFERNEN: "EINGABE_ENTFERNEN",
};

function view(dispatch, model) {
  return div({}, [
    input({
      type: "text",
      placeholder: "zBs. 200g Reis",
      oninput: (event) => dispatch({ type: MSGS.TEXT_EINGABE, value: event.target.value }),
      value: model.eingabeSpeichern,
    }),
    button({ onclick: () => dispatch({ type: MSGS.EINGABE_SPEICHERN }) }, "Speichern"),
    ul(
      {},
      model.textListe.map((inputText, index) =>
        li(
          { className: "flex gap-2 items-center", key: index },
          [
            inputText,
            button({
              onclick: () => dispatch({ type: MSGS.EINGABE_ENTFERNEN, index }),
            }, "Löschen")
          ]
        )
      )
    ),
  ]);
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.TEXT_EINGABE:
      return { ...model, eingabeSpeichern: msg.value };
    case MSGS.EINGABE_SPEICHERN:
      if (model.eingabeSpeichern.trim() !== "") {
        return {
          ...model,
          textListe: [...model.textListe, model.eingabeSpeichern],
          eingabeSpeichern: "",
        };
      }
      return model;
    case MSGS.EINGABE_ENTFERNEN:
      return {
        ...model,
        textListe: model.textListe.filter((_, index) => index !== msg.index),
      };
    default:
      return model;
  }
}

function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);

  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

const initModel = {
  eingabeSpeichern: "",
  textListe: [],
};

const rootNode = document.getElementById("app");

app(initModel, update, view, rootNode);
