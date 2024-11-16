import tensorflow as tf
import numpy as np
import math

class lhrNetDataLoader(tf.keras.utils.PyDataset):
    def __init__(self,csv_path,batch_size,**kwarg):
        super().__init__(**kwarg)

        self.x_file_arr = []
        self.y_arr = []

        with open(csv_path,"r") as f:
            for line in f:
                elems = line.split(",")

                self.x_file_arr.append(elems[0])
                self.y_arr.append(float(elems[1]))

        self.batch_size = batch_size

    def __len__(self):
        """
        Number of batches
        """
        return math.ceil(len(self.y_arr)/self.batch_size)

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
            x_arr.append(np.genfromtxt(self.x_file_arr[i],delimiter=","))

        return np.array(x_arr),np.array(self.y_arr[lower_bound:upper_bound])
