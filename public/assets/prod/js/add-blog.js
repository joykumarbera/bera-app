const EDITTOR_HOLDER_ID = 'editorjs';
const DEFAULT_INITIAL_DATA = () => {
  return {};
};
function Editor({
  initialData,
  onEditorUpdate
}) {
  const ejInstance = React.useRef();
  const [editorData, setEditorData] = React.useState(initialData);

  // This will run only once
  React.useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      if (ejInstance.current) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, []);
  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITTOR_HOLDER_ID,
      logLevel: "ERROR",
      data: editorData,
      onReady: () => {
        ejInstance.current = editor;
      },
      onChange: async (editorJs, event) => {
        const content = await editorJs.saver.save();
        setEditorData(content);
        onEditorUpdate(content);
      },
      autofocus: true,
      tools: {
        inlineCode: {
          class: InlineCode
        },
        header: Header,
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        code: CodeTool,
        image: {
          class: ImageTool,
          field: 'file',
          config: {
            endpoints: {
              byFile: '/api/media/upload/image',
              byUrl: '/api/media/upload/imagefromurl'
            }
          }
        },
        table: Table,
        warning: Warning
      }
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: EDITTOR_HOLDER_ID,
    style: {
      border: '1px solid var(--bs-border-color-translucent)',
      borderRadius: 'var(--bs-border-radius)'
    }
  }, " "));
}
function AddBlog() {
  const [authors, setAuthors] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [errors, setErrors] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [authorId, setAuthorId] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [summary, setSummary] = React.useState('');
  const [content, setContent] = React.useState('');
  const [status, setStatus] = React.useState('draft');
  const [featureImageUrl, setFeatureImageUrl] = React.useState('');
  React.useEffect(() => {
    fetch('/api/authors').then(res => res.json()).then(res => {
      setAuthors(res);
    });
  }, []);
  React.useEffect(() => {
    fetch('/api/tags').then(res => res.json()).then(res => {
      setTags(res);
    });
  }, []);
  React.useEffect(() => {
    if (tags.length > 0) {
      $('#tags').select2();
    }
  }, [tags]);
  function validateData() {
    const errors = {};
    setErrors(errors);
    if (authorId == '') {
      errors.authorId = "Author is required";
    }
    if (title == '') {
      errors.title = "Title is required";
    }
    if (summary == '') {
      errors.summary = "Summary is required";
    }
    if (content == '') {
      errors.content = "Content is required";
    }
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      return false;
    }
    return true;
  }
  function handleFeatureImageUpload(e) {
    const body = new FormData();
    body.append('image', e.target.files[0]);
    setIsLoading(true);
    fetch("/api/media/upload/image", {
      body: body,
      method: 'POST'
    }).then(res => res.json()).then(result => {
      setFeatureImageUrl(result.file.url);
    }).catch(err => console.log(err)).finally(() => {
      setIsLoading(false);
    });
  }
  function addBlog() {
    if (validateData() === false) {
      return;
    }
    let choosenTags = $('#tags').select2('data');
    choosenTags = choosenTags.map(item => {
      return {
        id: item.id,
        tag: item.text
      };
    });
    const data = {
      authorId: authorId,
      title: title,
      summary: summary,
      content: JSON.stringify(content),
      tags: JSON.stringify(choosenTags),
      featureImageUrl: featureImageUrl,
      status: status
    };
    setIsLoading(true);
    fetch('/api/blogs/create', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(result => {
      if (result.status) {
        window.location.replace('/admin/blogs');
      } else {
        window.location.reload();
      }
    }).catch(err => console.log(err)).finally(() => {
      setIsLoading(false);
    });
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h5", {
    className: "mt-3 ms-3 mb-4"
  }, "Add New Blog"), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Title"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "title",
    className: "form-control",
    required: true,
    value: title,
    onChange: e => setTitle(e.target.value)
  }), errors?.title && /*#__PURE__*/React.createElement("small", {
    style: {
      color: 'red'
    }
  }, errors?.title)), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Content"), /*#__PURE__*/React.createElement(Editor, {
    initialData: DEFAULT_INITIAL_DATA,
    onEditorUpdate: blogContent => {
      setContent(blogContent);
    }
  }), errors?.content && /*#__PURE__*/React.createElement("small", {
    style: {
      color: 'red'
    }
  }, errors?.content)), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Summary"), /*#__PURE__*/React.createElement("textarea", {
    type: "text",
    name: "content",
    className: "form-control",
    required: true,
    rows: "3",
    value: summary,
    onChange: e => setSummary(e.target.value)
  }), errors?.summary && /*#__PURE__*/React.createElement("small", {
    style: {
      color: 'red'
    }
  }, errors?.summary))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Author"), /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    onChange: e => setAuthorId(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ''
  }, "Select Author"), authors.map(item => {
    return /*#__PURE__*/React.createElement("option", {
      key: item.user_id,
      value: item.user_id
    }, item.name);
  })), errors?.authorId && /*#__PURE__*/React.createElement("small", {
    style: {
      color: 'red'
    }
  }, errors?.authorId)))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Feature Image"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    name: "tag_name",
    className: "form-control",
    required: true,
    onChange: e => handleFeatureImageUpload(e)
  })))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tags"), /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    multiple: "multiple",
    id: "tags"
  }, tags.map(item => {
    return /*#__PURE__*/React.createElement("option", {
      key: item.tag_id,
      value: item.tag_id
    }, item.name);
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Status"), /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    onChange: e => setStatus(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "draft"
  }, "Draft"), /*#__PURE__*/React.createElement("option", {
    value: "published"
  }, "Publish"), /*#__PURE__*/React.createElement("option", {
    value: "private"
  }, "Private"))))))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary mt-3 mb-2",
    disabled: isLoading,
    onClick: e => addBlog()
  }, isLoading ? 'Saving...' : 'Save')));
}
const rootNode = document.getElementById('add-blog');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(AddBlog));