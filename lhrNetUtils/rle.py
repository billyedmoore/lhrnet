import numpy as np
import re

def rle_encode(data,symbols= {False:"f",True:"t"}):
    """
    Run "Run Length Encoding" on a state to reduce the storage usage.
    """
    produced_str =  ""
    
    current_symbol = None
    count = 0

    for row in data:
        for value in row:
            if value != current_symbol:
                if count != 0:
                    produced_str += f"{count}{symbols[current_symbol]}"
                current_symbol = value
                count = 0
            count += 1
    
    if count != 0:
        produced_str += f"{count}{symbols[current_symbol]}"

    return produced_str


def rle_decode(rle_string, n_rows,n_cols, symbols= {"f":0,"t":1}):
    """
    Decode the "Run Length Encoded" state back into an numpy array
    """
    split_str = [s for s in re.split(r"(t|f)",rle_string) if s]
    split_str = [[symbols[split_str[i+1]]] * int(split_str[i]) for i in range(0,len(split_str),2)]
    ""

    flat_arr = []
    for sub_list in split_str:
        flat_arr.extend(sub_list)

    return np.array(flat_arr).reshape(n_rows,n_cols)
            

if __name__ == "__main__":
    rle_decode("2t40f1t80f1t77f1t105f1t35f1t72f1t14f1t48f1t60f1t2f1t6f1t4f1t8f1t162f1t99f1t152f1t1f1t2f1t2f2t1f1t50f1t3f1t7f1t7f1t39f1t19f1t3f1t32f1t27f1t21f1t11f1t9f1t71f1t3f1t19f1t11f1t32f2t115f1t22f1t63f1t5f1t46f1t5f1t20f1t100f1t183f1t29f1t21f1t53f",32,64)
