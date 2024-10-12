import os
import numpy as np
import glob

def data_generator(data_dir, batch_size):
    files = glob.glob(os.path.join(data_dir), "*_X.npy")

    while True:
        for b_start in range(0, len(files), batch_size):
            X_batch, y_batch = [], []
            for f in files[b_start:b_start+batch_size]:
                X = np.load(f)
                y = np.load(f.replace("_X.npy", "_y.npy"))
                X_batch.append(X)
                y_batch.append(y)
            yield np.concatenate(X_batch, axis=0), np.concatenate(y_batch, axis=0)
