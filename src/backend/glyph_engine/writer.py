import numpy as np
import matplotlib.pyplot as plt
import base64
from io import BytesIO
from tqdm.auto import tqdm
import json

cmap = plt.get_cmap('turbo')

def cycle_list(l, loops=1):
    n = len(l)
    for t in range(loops):
        l = [l[(i + 1) % n] for i in range(n)]
    return l

def generate_unique_combinations(L):
    combinations = generate_binary_strings(L)
    non_repeating = [combinations[0]]
    for i in tqdm(range(len(combinations)), desc="Generating Unique Binary Numbers"):
        ref = list(combinations[i])
        N = len(ref)
        test = 0
        for j in range(len(non_repeating)):
            for n in range(N):
                if cycle_list(list(non_repeating[j]), loops=n + 1) == ref:
                    test += 1
        if test == 0:
            non_repeating.append(combinations[i])
            
    for i in range(len(non_repeating)):
        non_repeating[i] = [int(s) for s in list(non_repeating[i])]
    return non_repeating

def generate_binary_strings(bit_count):
    binary_strings = []
    def genbin(n, bs=''):
        if len(bs) == n:
            binary_strings.append(bs)
        else:
            genbin(n, bs + '0')
            genbin(n, bs + '1')

    genbin(bit_count)
    return binary_strings

def decode_shape(in_array, k=1, point_color='k', on_color='darkred', off_color="grey",
                 label=None, base_fn=None, base_kwargs=[],
                 shape_fn=None, shape_kwargs=[], plot_base=False):
    n = len(in_array)
    x, y = base_fn(n, *base_kwargs)
    if plot_base:
        plt.scatter(x[1:], y[1:], s=70, facecolors='none', edgecolors=point_color)
        plt.scatter(x[0], y[0], s=70, facecolors=point_color, edgecolors=point_color)
        plt.axis('off')
        plt.axis('scaled')
    for i, elem in enumerate(in_array):
        P = [x[i], y[i]]
        Q = [x[(i + k) % n], y[(i + k) % n]]
        X, Y = shape_fn(P, Q, *shape_kwargs)
        if elem == 0:
            plt.plot(X, Y, color=off_color, ls="--", linewidth=0.25)
        elif elem == 1:
            plt.plot(X, Y, color=on_color, ls="-", label=label if i == np.where(in_array == 1)[0][0] else None,
                     linewidth=2)
        else:
            print(f'elem {elem} at index {i} is not valid, input being skipped')

def draw_multiple_inputs(in_array, concentration, ritual, 
                         base_fn=None, base_kwargs=[],
                         shape_fn=None, shape_kwargs=[],
                         point_color='k', labels=[], legend=False, colors=[],
                         legend_loc="upper left"):
    
    if isinstance(colors, list) and len(colors) == 0:
        colors = [point_color] * in_array.shape[0]
    elif isinstance(colors, str):
        colors = [colors] * in_array.shape[0]
    n = in_array.shape[1]
    x, y = base_fn(n, *base_kwargs)
    plt.scatter(x[1:], y[1:], s=70, facecolors='none', edgecolors=point_color)
    plt.scatter(x[0], y[0], s=70, facecolors=point_color, edgecolors=point_color)
    
    if len(labels) != in_array.shape[0]:
        labels = [None] * in_array.shape[0]

    for i, k in enumerate(range(in_array.shape[0])):
        decode_shape(in_array[i], k=k + 1, base_fn=base_fn, base_kwargs=base_kwargs,
                     shape_fn=shape_fn, shape_kwargs=shape_kwargs, label=labels[i], on_color=colors[i])

    if labels[0] is not None and legend:
        handles, labels = plt.gca().get_legend_handles_labels()
        
        conc_line, = plt.plot([], [], 'o', color='black', label=f"Concentration: {concentration}")
        ritual_line, = plt.plot([], [], 'o', color='black', label=f"Ritual: {ritual}")
        
        base_name = base_fn.__name__
        shape_name = shape_fn.__name__
        base_line, = plt.plot([], [], '-', color='black', label=f"Base: {base_name}")
        shape_line, = plt.plot([], [], '-', color='black', label=f"Shape: {shape_name}")
        
        handles.extend([conc_line, ritual_line, base_line, shape_line])
        labels.extend([f"Concentration: {concentration}", f"Ritual: {ritual}",
                      f"Base: {base_name}", f"Shape: {shape_name}"])

        plt.legend(loc=legend_loc, fontsize=10)
        
    plt.axis('off')
    plt.axis('scaled')

def draw_spell(level, rang, area, dtype, school, duration, condition, 
               concentration, ritual, base_fn, shape_fn, include_conditions=True,
               base_kwargs=[], shape_kwargs=[], colors=[], legend_loc="upper left", 
               breakdown=True):
    plt.clf()

    ranges = load_attributes("range")
    levels = load_attributes("levels")
    area_types = load_attributes("area_types")
    dtypes = load_attributes("damage_types")
    schools = load_attributes("school")
    durations = load_attributes("duration")
    conditions = load_attributes("conditions")
    
    i_range = [r.lower() for r in ranges].index(rang.lower())
    i_levels = levels.index(str(level))
    i_area = [a.lower() for a in area_types].index(area.lower())
    i_dtype = [dt.lower() for dt in dtypes].index(dtype.lower())
    i_school = [s.lower() for s in schools].index(school.lower())
    i_duration = [d.lower() for d in durations].index(duration.lower())
    i_condition = [ct.lower() for ct in conditions].index(condition.lower())

    attributes = [i_levels, i_school, i_duration, i_range, i_area, i_dtype, i_condition]
    labels = [f"Level: {level}", 
             f"School: {school}", 
             f"Duration: {duration}", 
             f"Range: {rang}", 
             f"Area Type: {area}", 
             f"Damage Type: {dtype}",
             f"Condition: {condition}"]
    N = 2 * len(attributes) + 1
    
    if breakdown:
        if len(colors) == 0:
            colors = [cmap(i / len(attributes)) for i in range(len(attributes))]
    else:
        if len(colors) == 0:
            colors = ['blue'] * N
        if len(colors) < N:
            colors.extend(['red'] * (N - len(colors)))

    non_repeating = generate_unique_combinations(N)
    non_repeating = np.array(non_repeating)
    input_array = np.array([non_repeating[i] for i in attributes])

    draw_multiple_inputs(input_array, concentration, ritual, base_fn=base_fn, labels=labels, legend=True,
                        base_kwargs=base_kwargs,
                        shape_fn=shape_fn, shape_kwargs=shape_kwargs,
                        colors=colors, legend_loc=legend_loc)

    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    plt.close()
    
    return image_base64

def load_attributes(attr_name):
    with open(f"src/data/attributes.json", "r") as f:
        attributes = json.load(f)
    return attributes[attr_name]
