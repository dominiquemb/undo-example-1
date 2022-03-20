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

function Approach2() {
  const [changeList, setChangeList] = React.useState([]);
  const [availableTargets, setAvailableTargets] = React.useState([
    "Spiderman",
    "Batman",
    "Superman",
  ]);
  const defaultBlockSettings = {
      value: '',
      lastUpdated: new Date().getTime(),
      deleted: false,
      targets: [],
  };
  const [blocks, setBlocks] = React.useState(
    {
      "block-1":
      {
        id: 'block-1',
        value: '',
        lastUpdated: new Date().getTime(),
        deleted: false,
        targets: [],
      },
      "block-2":
      {
        id: 'block-2',
        value: '',
        deleted: false,
        lastUpdated: new Date().getTime(),
        targets: [],
      }
    }
  );

  const deepCopy = (object) => {
    try {
      return JSON.parse(JSON.stringify(object));
    } catch (e) {
      console.log(e);
    }
  }

  const deleteBlock = (blockId, block) => {
    const updatedTime = new Date().getTime();
    const blocksCopy = deepCopy(blocks);
    const updatedBlock = deepCopy(block);

    updatedBlock.deleted = true;
    updatedBlock.lastUpdated = updatedTime;

    blocksCopy[blockId] = updatedBlock;
    setBlocks(blocksCopy);

    const newRevision = {
      target: block.id,
      oldValue: deepCopy(block),
      newValue: deepCopy(updatedBlock),
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
    const blocksCopy = deepCopy(blocks);
    const updatedBlock = deepCopy(block);

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
      return revision;
    });
    return latestRevision;
  }

  const saveTextField = (block) => {
    const updatedTime = new Date().getTime();

    const oldValue = findLatestRevision(block.id);

    const newRevision = {
      target: block.id,
      oldValue: oldValue && oldValue.newValue ? deepCopy(oldValue.newValue) : undefined,
      newValue: deepCopy(block),
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

    const newRevision = {
      target: block.id,
      oldValue: deepCopy(blocks[block.id]),
      newValue: deepCopy(updatedBlock),
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
        const blocksCopy = {...blocks};
        let undeleted = false;

        const changeThatIsBeingUndone = deepCopy(obj.newValue);
        const changeThatExistedBefore = obj.oldValue ? deepCopy(obj.oldValue) : deepCopy({...defaultBlockSettings, id: obj.target});

        if (blocks[obj.target].deleted === true) {
          // for the note field, to emphasize that this block was undeleted
          undeleted = true;
        }

        const updatedBlock = changeThatExistedBefore;

        updatedBlock.lastUpdated = updatedTime;

        const newRevision = {
          target: targetId,
          oldValue: deepCopy(changeThatIsBeingUndone),
          newValue: deepCopy(changeThatExistedBefore),
          timestamp: updatedTime,
          note: undeleted ? "Block was un-deleted during this revision" : "",
        };

        blocksCopy[targetId] = updatedBlock;
        setBlocks(blocksCopy);

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
                  <Paper key={index} elevation={3} style={{width: '100%', padding: 5, margin: 10}}>
                    <ListItem >
                        <Grid container>
                          <Grid item xs={9}>
                            <p>Block ID: {change.target}</p>
                            <p style={{wordBreak: 'break-word'}}>Old value: {JSON.stringify(change.oldValue)}</p>
                            <p style={{wordBreak: 'break-word'}}>New value: {JSON.stringify(change.newValue)}</p>
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
            <p>Keep a list of changes that are specific to each block or asset, and restore the state of the block/asset to a previous version. This is a variation of approach #1 but would not overwrite changes made in other parts of the application when a previous version is restored. It would, however, overwrite newer changes that are specific to the block/asset.
  </p>

            <p><strong>Advantages:</strong>  Less expensive in terms of storage, and would not overwrite any changes that are unrelated to the current block/asset. Also guarantees data consistency of the specific block or asset.   </p>

            <p><strong>Disadvantages:</strong> Some newer changes to the block/asset might get erased in the process of reverting to an older version. Also requires the creation of new tables or columns in the database and additional logic added to each feature of the application to be able to keep track of all revisions to a block/asset.
  </p>
            <p><strong>Here's an example of the undo logic implementation</strong>, which accounts for un-deleting blocks if a change is undone:</p>

            <img src="/images/approach_2_undo_example.png" width="100%" alt="Screenshot of undo code implementation" />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Approach2;
