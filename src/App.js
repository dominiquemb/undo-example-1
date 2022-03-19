import './App.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

function App() {
  const [textFieldVal, setTextFieldVal] = React.useState();
  const [oldTextFieldVal, setOldTextFieldVal] = React.useState();
  const [changeList, setChangeList] = React.useState([]);
  const [availableTargets, setAvailableTargets] = React.useState([
    "Spiderman",
    "Batman",
    "Superman",
  ]);
  const [blocks, setBlocks] = React.useState(
    {
      "block-1":
      {
        id: 'block-1',
        value: '',
        lastUpdated: new Date().getTime(),
        deleted: false,
        targets: [],
        revisions: [],
      },
      "block-2":
      {
        id: 'block-2',
        value: '',
        deleted: false,
        lastUpdated: new Date().getTime(),
        targets: [],
        revisions: [],
      }
    }
  );

  const deleteBlock = (blockId, block) => {
    const updatedTime = new Date().getTime();
    const blocksCopy = {...blocks};
    const updatedBlock = {...block};

    updatedBlock.deleted = true;
    updatedBlock.lastUpdated = updatedTime;

    blocksCopy[blockId] = updatedBlock;
    setBlocks(blocksCopy);

    const newRevision = {
      target: blockId,
      type: "deleted",
      oldValue: false,
      newValue: true,
      timestamp: updatedTime,
    };

    updateRevisions(newRevision);
  }

  const updateRevisions = (newRevision) => {
    const currentChangeList = [...changeList];
    currentChangeList.push(newRevision);
    setChangeList([...currentChangeList]);
  }

  const handleTextFieldChange = (evt, block) => {
    const updatedTime = new Date().getTime();
    const blocksCopy = {...blocks};
    const updatedBlock = {...block};

    updatedBlock.value = evt.target.value;
    updatedBlock.lastUpdated = updatedTime;

    blocksCopy[block.id] = updatedBlock;
    setBlocks(blocksCopy);
  }

  const findLatestRevision = (blockId) => {
    let latestRevision;
    changeList.map((revision) => {
      if (revision.target === blockId) {
        latestRevision = revision;
      }
    });
    return latestRevision;
  }

  const saveTextField = (val, block) => {
    const updatedTime = new Date().getTime();

    const oldValue = findLatestRevision(block.id);

    const newRevision = {
      target: block.id,
      type: "value",
      oldValue: oldValue ? oldValue.newValue : undefined,
      newValue: val,
      timestamp: updatedTime,
    };

    updateRevisions(newRevision);
  }

  const handleTextFieldSaveOnEnter = (evt, block) => {
    if (evt && evt.key === "Enter") {
      evt.preventDefault();

      saveTextField(evt.target.value, block);
    }
  }

  const handleTextFieldSavePress = (val, block) => {
    saveTextField(val, block);
  }

  const handleTargetChange = (evt, target, block) => {
    const updatedTime = new Date().getTime();
    const blocksCopy = {...blocks};
    const updatedBlock = {...block};
    const oldTargets = [...block.targets];
    
    updatedBlock.lastUpdated = updatedTime;

    if (evt.target.checked) {
      // target being added
      if (updatedBlock.targets.indexOf(target) === -1) {
        updatedBlock.targets.push(target);
      }
    } else {
      // target being removed
      let updatedTargets = updatedBlock.targets.filter((oldTarget) => oldTarget !== target);
      updatedBlock.targets = updatedTargets;
    }

    const newRevision = {
      target: block.id,
      type: "targets",
      oldValue: oldTargets,
      newValue: updatedBlock.targets,
      timestamp: updatedTime,
    };

    blocksCopy[block.id] = updatedBlock;
    setBlocks(blocksCopy);

    updateRevisions(newRevision);
  }

  const undo = (obj) => {
    const targetId = obj.target;
    const updatedTime = new Date().getTime();

    if (obj) {
      if (obj.type === "value") {
        const blocksCopy = {...blocks};
        const updatedBlock = {...blocks[targetId]};
        let undeleted = false;

        if (updatedBlock.deleted) {
          // undo block deletion if it is currently "deleted"
          updatedBlock.deleted = false;
          undeleted = true;
        }

        const previousValueBeforeUndo = blocks[targetId].value;

        updatedBlock.value = obj.oldValue ? obj.oldValue : '';
        updatedBlock.lastUpdated = updatedTime;

        const newRevision = {
          target: targetId,
          type: "value",
          oldValue: previousValueBeforeUndo,
          newValue: updatedBlock.value,
          timestamp: updatedTime,
          note: undeleted ? "Block was un-deleted during this revision" : "",
        };

        updatedBlock.revisions.push(newRevision);
        blocksCopy[targetId] = updatedBlock;
        setBlocks(blocksCopy);

        updateRevisions(newRevision);
      }

      if (obj.type === "targets") {
        const blocksCopy = {...blocks};
        const updatedBlock = {...blocks[targetId]};
        let undeleted = false;

        if (updatedBlock.deleted) {
          // undo block deletion if it is currently "deleted"
          updatedBlock.deleted = false;
          undeleted = true;
        }

        const changeThatIsBeingUndone = findLatestRevision(targetId).newValue;

        updatedBlock.lastUpdated = updatedTime;

        updatedBlock.targets = obj.oldValue;

        const newRevision = {
          target: targetId,
          type: "targets",
          oldValue: changeThatIsBeingUndone,
          newValue: updatedBlock.targets,
          timestamp: updatedTime,
          note: undeleted ? "Block was un-deleted during this revision" : "",
        };

        updatedBlock.revisions.push(newRevision);
        blocksCopy[targetId] = updatedBlock;
        setBlocks(blocksCopy);

        updateRevisions(newRevision);
      }

      if (obj.type === "deleted") {
        const blocksCopy = {...blocks};
        const updatedBlock = {...blocks[targetId]};
        let undeleted = false;

        if (obj.deleted === true) {
          // for the note field, to emphasize that this block was undeleted
          undeleted = true;
        }

        const changeThatIsBeingUndone = findLatestRevision(targetId).newValue;

        updatedBlock.lastUpdated = updatedTime;

        updatedBlock.deleted = obj.oldValue;

        const newRevision = {
          target: targetId,
          type: "deleted",
          oldValue: changeThatIsBeingUndone,
          newValue: updatedBlock.deleted,
          timestamp: updatedTime,
          note: undeleted ? "Block was un-deleted during this revision" : "",
        };

        updatedBlock.revisions.push(newRevision);
        blocksCopy[targetId] = updatedBlock;
        setBlocks(blocksCopy);

        updateRevisions(newRevision);
      }
    }
  }

  return (
    <div className="App">
      <Grid container>
        <Grid item xs={12} md={4}>
          {Object.keys(blocks).map((blockId) => (
            <div key={blockId}>
              {blocks[blockId].deleted ? (
                <></>
              ) : (
                <div style={{padding: 20}} >
                  <Paper elevation={3}>
                    <div id={blockId} style={{ padding: 20 }}>
                      <Grid container>
                        <Grid item xs={12}>
                          <div style={{marginBottom: 20}}><strong>{blocks[blockId].id}</strong></div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField 
                          id="outlined-basic" 
                          fullWidth
                          variant="outlined" 
                          placeholder="Press enter to save text"
                          value={blocks[blockId].value} 
                          onChange={(evt) => handleTextFieldChange(evt, blocks[blockId])} 
                          onKeyDown={(evt) => handleTextFieldSaveOnEnter(evt, blocks[blockId])} 
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Button style={{margin: 5}} variant="contained" onClick={() => handleTextFieldSavePress(blocks[blockId].value, blocks[blockId])}>Save</Button>
                          <Button style={{margin: 5}} variant="contained" color="error" onClick={() => deleteBlock(blockId, blocks[blockId])}>Delete Block</Button>
                        </Grid>

                        <Grid item xs={12}>
                          <FormGroup style={{textAlign: 'left'}}>
                            <div style={{marginBottom: 10, marginTop: 15 }}>Who can see this block:</div>
                            {availableTargets.map((target, index) => (
                              <FormControlLabel key={index} control={<Checkbox />} checked={blocks[blockId].targets.indexOf(target) > -1 ? true : false} onChange={(evt) => handleTargetChange(evt, target, blocks[blockId])} label={target} />
                            ))}
                          </FormGroup>
                        </Grid>
                      </Grid>
                    </div>
                  </Paper>
                </div>
              )}
            </div>
          ))}
        </Grid>
      
        <Grid item xs={12} md={3}>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <div style={{marginBottom: 20, marginTop: 20}}><strong>List of revisions (newest at top):</strong></div>
            {changeList.length ? (
              <>
                {changeList.map((change, index) => (
                  <Paper elevation={3} style={{width: '100%', padding: 5, margin: 10}}>
                    <ListItem key={index}>
                        <Grid container>
                          <Grid item xs={9}>
                            <p>Block ID: {change.target}</p>
                            <p>Type of change: {change.type}</p>
                            <p>Old value: {JSON.stringify(change.oldValue)}</p>
                            <p>New value: {JSON.stringify(change.newValue)}</p>
                            <p><strong>{change.note}</strong></p>
                          </Grid>
                          <Grid item xs={3}>
                            <Button style={{margin: 5}} variant="contained" onClick={() => undo(change)}>Undo</Button>
                          </Grid>
                        </Grid>
                    </ListItem>
                  </Paper>
                )).reverse()}
              </>
            ) : (
              <div>No changes yet. Go make some changes in the blocks on the left.</div>
            )}
          </List>
        </Grid>

        <Grid item xs={12} md={5}>
          <div style={{textAlign: 'left', padding: 20}}>
            <p><strong>Summary:</strong></p>
            <p>Every time a change is made to a block/asset/setting, store a “reverse” version of the action. For example, if an asset is renamed, store the old name so that this specific action can be reversed. If an asset is deleted, don’t actually delete it in the database, simply mark it as hidden so it can be restored at a later time.
              </p>

            <p><strong>Advantages:</strong> Not very expensive in terms of storage. Also, for simple actions, this would not overwrite any other actions taken between the time the asset was changed and the present time. 
              </p>

            <p>It would also be possible to only undo actions done by a specific user, or all actions of the same “type” such as moving files.
              </p>

            <p><strong>Disadvantages:</strong> This may overwrite changes which are cumulative (i.e. built on top of another change), or which depend on external contexts.  
              </p>

            <p>For example, if a block has been deleted but the user wants to restore some text content to it, there needs to be logic in place to handle both the re-creation of the block and the changing of text.
              </p>

            <p>This is why, when undoing an action, it is important to store all the parameters that were used for the construction of the object in order to create it again.
              </p>

            <p>This also requires the addition of “undo” logic for each feature and a way to track each individual change.
              </p>

            <p><strong>Here's an example of the undo logic implementation</strong>, which accounts for un-deleting blocks if a change is undone:</p>

            <img src="/images/approach_1_undo_example.png" width="100%" />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
