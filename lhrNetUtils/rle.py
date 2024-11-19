import numpy as np

def rle_encode(data,symbols= {False:"f",True:"t"},seperator="_"):
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
                    produced_str += f"{seperator}{count}{symbols[current_symbol]}"
                current_symbol = value
                count = 0
            count += 1
    
    if count != 0:
        produced_str += f"{seperator}{count}{symbols[current_symbol]}"

    return produced_str[1:]


def rle_decode(rle_string, n_rows,n_cols, symbols= {"f":0,"t":1},seperator="_"):
    """
    Decode the "Run Length Encoded" state back into an numpy array
    """
    flat_arr = []
    split_str = [[symbols[val[-1]]] * int(val[:-1]) for val in rle_string.split(seperator)]
    for sub_list in split_str:
        flat_arr.extend(sub_list)
    return np.array(flat_arr).reshape(n_rows,n_cols)
            

