import '../App.css';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

function Approach3() {
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

  const deepCopy = (object) => {
    return JSON.parse(JSON.stringify(object));
  }

  const deleteBlock = (blockId, block) => {
    const updatedTime = new Date().getTime();
    const blocksCopy = deepCopy(blocks);
    const updatedBlock = deepCopy(block);

    updatedBlock.deleted = true;
    updatedBlock.lastUpdated = updatedTime;

    blocksCopy[blockId] = updatedBlock;

    const newRevision = {
      target: block.id,
      newValue: deepCopy(blocksCopy),
      timestamp: updatedTime,
    };

    setBlocks(blocksCopy);

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

  const saveTextField = (block) => {
    const updatedTime = new Date().getTime();

    const newRevision = {
      target: block.id,
      newValue: deepCopy(blocks),
      timestamp: updatedTime,
    };

    updateRevisions(newRevision);
  }

  const handleTextFieldSaveOnEnter = (evt, block) => {
    if (evt && evt.key === "Enter") {
      evt.preventDefault();

      saveTextField(block);
    }
  }

  const handleTextFieldSavePress = (val, block) => {
    saveTextField(block);
  }

  const handleTargetChange = (evt, target, block) => {
    const updatedTime = new Date().getTime();
    const blocksCopy = deepCopy(blocks);
    const updatedBlock = deepCopy(block);
    
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

    blocksCopy[block.id] = updatedBlock;

    const newRevision = {
      target: block.id,
      newValue: deepCopy(blocksCopy),
      timestamp: updatedTime,
    };

    setBlocks(blocksCopy);

    updateRevisions(newRevision);
  }

  const undo = (obj) => {
    const targetId = obj.target;
    const updatedTime = new Date().getTime();

    if (obj) {
        const changeThatExistedBefore = obj.newValue;

        const newRevision = {
          target: targetId,
          newValue: deepCopy(changeThatExistedBefore),
          timestamp: updatedTime,
        };

        setBlocks(deepCopy(changeThatExistedBefore));

        updateRevisions(newRevision);
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
                          <Grid item xs={8}>
                            <p>Timestamp: {change.timestamp}</p>
                            <p style={{wordBreak: 'break-word'}}>Value: {JSON.stringify(change.newValue)}</p>
                          </Grid>
                          <Grid item xs={4}>
                            <Button style={{margin: 5}} variant="contained" onClick={() => undo(change)}>Restore</Button>
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
            <p>Saving backups at each state of the application and simply replacing the unwanted new state with the old backup. This is how Photoshop handles their undo system.
    </p>

            <p><strong>Advantages:</strong> Requires less time/effort to implement, guarantees data consistency, guarantees a full restore to the previous application state, and does not require keeping track of a list of individual user actions. 
  </p>

            <p><strong>Disadvantages:</strong> Some newer data might get erased in the process of restoring the backup. It is also expensive (in terms of storage) to store backups of the entire database, especially because these backups would need to be made every time a user makes a change to the data.
    </p>

            <p><strong>Here's an example of the undo logic implementation</strong>, which accounts for un-deleting blocks if a change is undone:</p>

            <img src="/images/approach_3_undo_example.png" width="100%" alt="Screenshot of undo code implementation" />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Approach3;