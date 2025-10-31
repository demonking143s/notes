import Note from '../model/note.model.js'; 

export const addNotes = async (req, res) => {
    try {
        const {title, content, tags} = req.body;

        const userId = req.user._id;
        if(!title && !content && !tags){
            return res.status(400).json({message: "No notes added"})
        }

        const newNote = new Note ({
            userId: userId,
            title: title || "untitled",
            content: content || " ",
            tags: tags || [],
        })

        if(newNote) {
            await newNote.save(); 
            return res.status(200).json({message: "new note added successfully"})
        }
    } catch (error) {
        console.log("Error in addNotes page", error);
        return res.status(500).json({error: "Internal server error"})
    }
}

export const viewNotes = async (req, res) => {
    try {
        const userId = req.user._id;

        const myNotes = await Note.find({userId}); 

        if(!myNotes) {
            return res.status(400).json({error: "no notes found"})
        }

        return res.status(200).json(myNotes)
    } catch (error) {
        console.log("Error in viewNotes page", error);
        return res.status(500).json({error: "Internal server error"})
    }
}

export const viewNote = async (req, res) => {
    try {
        const id = req.params.id;

        const note = await Note.findById(id);

        if(!note) {
            return res.status(400).json({error: "no note found"});
        }

        return res.status(200).json(note)
    } catch (error) {
        console.log("Error in Viewnote page", error);
        return res.status(500).json({error: "Internal server error"});
    }
}

export const editNotes = async (req, res) => {
    try {
        const notesId = req.params.id;

        const editNote = await Note.findById(notesId); 

        if(!editNote) {
            return res.status(400).json({error: "no notes found"});
        }
        
        const {title, content, tags} = req.body;

        editNote.title = title || "untitled";
        editNote.content = content || " ";
        editNote.tags = tags || [];

        await editNote.save(); 

        return res.status(200).json({message: "notes updated successfully"})
    } catch (error) {
        console.log("Error in editNotes page", error);
        return res.status(500).json({error: "Internal server error"})
    }
}

export const deleteNotes = async (req, res) => {
    try {
        const notesId = req.params.id;

        await Note.findByIdAndDelete(notesId); 

        return res.status(200).json({message:"notes deleted successfully"})
    } catch (error) {
        console.log("Error in deleteNotes page", error);
        return res.status(500).json({error: "Internal server error"})
    }
}