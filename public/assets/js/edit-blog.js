const EDITTOR_HOLDER_ID = 'editorjs';

function Editor({initialData, onEditorUpdate}) {
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
        }
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
                    class: InlineCode,
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
                            byUrl: '/api/media/upload/imagefromurl',
                        }
                    }
                },
                table: Table,
                warning: Warning
            },
        });
    };

    return (
        <React.Fragment>
            <div id={EDITTOR_HOLDER_ID} style={{ 
                border: '1px solid var(--bs-border-color-translucent)',
                borderRadius: 'var(--bs-border-radius)'
             }}> </div>
        </React.Fragment>
    );
}

function EditBLog() {
    const [authors, setAuthors] = React.useState([]);
    const [tags, setTags] = React.useState([]);
    const [errors, setErrors] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);

    const [blog, setBlog] = React.useState(null);
    const [authorId, setAuthorId] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [summary, setSummary] = React.useState('');
    const [content, setContent] = React.useState('');
    const [status, setStatus] = React.useState('draft');
    const [featureImageUrl, setFeatureImageUrl] = React.useState('');
    const [currentFeatureImageUrl, setCurrentFeatureImageUrl] = React.useState('');
    const [previewUrl, setPreviewUrl] = React.useState('');

    React.useEffect( () => {
        fetch('/api/authors')
        .then( res => res.json() )
        .then( res => {
            setAuthors(res)
        } )
    }, []);

    React.useEffect( () => {
        fetch('/api/tags')
        .then( res => res.json() )
        .then( res => {
            setTags(res)
        } )
    }, []);

    React.useEffect( () => {
        if(tags.length > 0) {
            $('#tags').select2();
        }
    }, [tags]);

    React.useEffect( () => {
        const urlParams = new URLSearchParams(window.location.search);
        const blog_id = urlParams.get('blog_id');

        JsLoadingOverlay.show({'spinnerIcon': 'ball-beat'});
        fetch(`/api/blogs/${blog_id}`)
        .then( res => res.json() )
        .then( res => {
            setBlog(res.data)
        })
        .finally( () => {
            setIsLoading(false)
            JsLoadingOverlay.hide();
        } )
    }, []);

    React.useEffect( () => {
        if(blog) {
            setTitle(blog.title);
            setContent(JSON.parse(blog.json_content));
            setSummary(blog.summary);
            setStatus(blog.status);
            setCurrentFeatureImageUrl(`${blog.image_url}?tr=w-120,h-120`);
            setAuthorId(blog.author_id);
            setPreviewUrl(`/blog/${blog.slug}/preview`);

            const choosenTagIds = blog.tags.map( (item) => item.tag_id )
            $('#tags').val(choosenTagIds);
            $('#tags').trigger('change');
        }
    }, [blog])
 
    function validateData() {
        const errors = {}
        setErrors(errors);

        if(authorId == '') {
            errors.authorId = "Author is required"
        }

        if(title == '') {
            errors.title = "Title is required"
        }

        if(summary == '') {
            errors.summary = "Summary is required"
        }

        if(content == '') {
            errors.content = "Content is required"
        }

        setErrors(errors);

        if(Object.keys(errors).length > 0) {
            return false;
        }

        return true;
    }

    function handleFeatureImageUpload(e) {
        const body = new FormData()
        body.append('image', e.target.files[0])

        setIsLoading(true)
        fetch("/api/media/upload/image", {
            body: body,
            method: 'POST'
        }).then( res => res.json() )
        .then( (result) => {
            setFeatureImageUrl(result.file.url)
        })
        .catch( err => console.log(err) )
        .finally( () => {
            setIsLoading(false)
        })
    }

    function updateBlog() {
        if(validateData() === false) {
            return;
        }
        
        let choosenTags = $('#tags').select2('data');
        choosenTags = choosenTags.map( (item) => {
            return {
                id: item.id,
                tag: item.text
            }
        } )

        const data = {
            authorId: authorId,
            title: title,
            summary: summary,
            content: JSON.stringify(content),
            tags: JSON.stringify(choosenTags),
            featureImageUrl: featureImageUrl,
            status: status,
        }

        setIsLoading(true);
        fetch(`/api/blogs/${blog.blog_id}/update`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then( res => res.json() )
        .then( (result) => {
            window.location.reload();
        })
        .catch( err => console.log(err) )
        .finally( () => {
            setIsLoading(false)
        });
    }

    return (
        <>
            <h5 className="mt-3 ms-3 mb-4">Update Blog - {blog?.title}</h5>

            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input type="text" name="title" className="form-control" required value={title} onChange={ (e) => setTitle(e.target.value) } />
                                    {
                                       errors?.title && (
                                            <small style={{ color: 'red' }}>{errors?.title}</small>
                                       )
                                    }
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Content</label>
                                    {
                                        !isLoading && (
                                            <Editor 
                                                initialData={JSON.parse(blog?.json_content)}
                                                onEditorUpdate={ (blogContent) => {
                                                    setContent(blogContent)
                                                }}
                                            />
                                        )
                                    }
                                    
                                    {
                                       errors?.content && (
                                            <small style={{ color: 'red' }}>{errors?.content}</small>
                                       )
                                    }
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Summary</label>
                                    <textarea type="text" name="content" className="form-control" required rows="3" value={summary} onChange={ (e) => setSummary(e.target.value) } />
                                    {
                                       errors?.summary && (
                                            <small style={{ color: 'red' }}>{errors?.summary}</small>
                                       )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Author</label>
                                    <select className="form-control" value={authorId} onChange={ (e) => setAuthorId(e.target.value) }>
                                        <option value={''}>Select Author</option>
                                        {
                                            authors.map( (item) => {
                                                return (
                                                    <option key={item.user_id} value={item.user_id}>{item.name}</option>
                                                )
                                            } )
                                        }
                                    </select>
                                    {
                                       errors?.authorId && (
                                            <small style={{ color: 'red' }}>{errors?.authorId}</small>
                                       )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Feature Image</label>
                                    <input type="file" className="form-control" required onChange={ (e) => handleFeatureImageUpload(e) } />
                                </div>
                                
                                {
                                    currentFeatureImageUrl != '' && (
                                    <div className="text-center">
                                        <img src={currentFeatureImageUrl} />
                                    </div>
                                    )
                                }
                                
                            </div>
                        </div>

                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Tags</label>
                                    <select className="form-control" multiple="multiple" id="tags">
                                        {
                                            tags.map( (item) => {
                                                return (
                                                    <option key={item.tag_id} value={item.tag_id}>{item.name}</option>
                                                )
                                            } )
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select className="form-control" value={status} onChange={ (e) => setStatus(e.target.value) }>
                                        <option value="draft">Draft</option>
                                        <option value="published">Publish</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <button 
                        type="submit" 
                        className="btn btn-primary mt-3 mb-2"
                        disabled={isLoading}
                onClick={ (e) => updateBlog() }>{ isLoading ? 'Saving...' : 'Update' }</button>
                {!isLoading && (
                    <a href={previewUrl} className="btn btn-outline-primary mt-3 mb-2 ms-3" target="_blank">
                        Preview
                    </a>
                )}
            </div>
        </>
    )
}

const rootNode = document.getElementById('edit-blog');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(EditBLog));