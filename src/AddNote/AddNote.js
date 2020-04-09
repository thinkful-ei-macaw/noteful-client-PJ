import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";
import config from "../config";
import "./AddNote.css";

export default class AddNote extends Component {
  static defaultProps = {
    history: {
      push: () => {},
    },
  };
  static contextType = ApiContext;

  handleSubmit = (e) => {
    e.preventDefault();
    const newNote = {
      title: e.target["note-name"].value,
      content: e.target["note-content"].value,
      folder_id: e.target["note-folder-id"].value,
      modified: new Date(),
    };
    
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((note) => {
        
        
        this.context.addNote(note);
        this.props.history.push(`/folder/${note.folderId}`);
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  render() {
    const { folders = [] } = this.context;
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>Name</label>
            <input required type='text' id='note-name-input' name='note-name' />
          </div>
          <div className='field'>
            <label   htmlFor='note-content-input'>Content</label>
            <textarea required id='note-content-input' name='note-content' />
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>Folder</label>
            <select required id='note-folder-select' name='note-folder-id'>
              <option value={null}>...</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.title}
                </option>
              ))}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit'>Add note</button>
          </div>
        </NotefulForm>
      </section>
    );
  }
}
