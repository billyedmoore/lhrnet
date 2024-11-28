import tensorflow as tf

from sklearn.utils import class_weight
import numpy as np
import math

from .rle import rle_decode

class lhrNetDataLoader(tf.keras.utils.PyDataset):
    def __init__(self,csv_path,n_cols,n_rows,n_states,batch_size,**kwarg):
        super().__init__(**kwarg)
        self.batch_size = batch_size

        self.x_rle_arr = []
        self.y_arr = []

        self.n_rows = n_rows
        self.n_cols = n_cols

        self.n_states = n_states


        with open(csv_path,"r") as f:
            for line in f:
                elems = line.split(",")

                self.x_rle_arr.append(elems[0])
                self.y_arr.append(float(elems[1]))

    def __len__(self):
        """
        Number of batches
        """
        return math.ceil(len(self.y_arr)/self.batch_size)

    @property
    def X(self):
        """
        Get the y dataset

        Returns:
            (np.array): xs for the data
        """
        arr = None

        for i in range(len(self)):
            if isinstance(arr,np.ndarray):
                arr = np.concatenate((arr,self[i][0]))
            else:
                arr = np.array(self[i][0])

        return arr

    @property
    def y(self):
        """
        Get the y dataset

        Returns:
            (np.array): ys for the data (aka labels)
        """
        return tf.keras.utils.to_categorical(self.y_arr,num_classes=self.n_states)

    def __getitem__(self,batch_index):
        """
        Get a batch of items

        Args:
            batch_index (int)

        Returns:
            (np.array): xs in the batch
            (np.array): ys in the batch (aka labels)
        """
        lower_bound = batch_index * self.batch_size
        upper_bound = min(lower_bound + self.batch_size,len(self.y_arr))
        x_arr = []
        for i in range(lower_bound,upper_bound):
            x_arr.append(rle_decode(self.x_rle_arr[i],self.n_rows,self.n_cols))
        y = tf.keras.utils.to_categorical(self.y_arr[lower_bound:upper_bound],num_classes=self.n_states)
        x = np.array(x_arr)
        return x,y
