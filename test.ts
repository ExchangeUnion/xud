// if the id in vvNew is not the same as the one we are trying to place
if (vvNew[nUBucket][nUBucketPos] != nId) { 

  bool fInsert = vvNew[nUBucket][nUBucketPos] == -1; // true if there is a -1 there
  
  if (!fInsert) { // if there is not a -1 there
    CAddrInfo& infoExisting = mapInfo[vvNew[nUBucket][nUBucketPos]];
    if (infoExisting.IsTerrible() || (infoExisting.nRefCount > 1 && pinfo->nRefCount == 0)) {
      // Overwrite the existing new table entry.
      fInsert = true;
    }
  }

  if (fInsert) { // if there is a -1 there or we are overwriting
    ClearNew(nUBucket, nUBucketPos); // clear that id from map
    pinfo->nRefCount++;
    vvNew[nUBucket][nUBucketPos] = nId;
  } 

  else { 
    if (pinfo->nRefCount == 0) {
      Delete(nId);
    }
  }
}
