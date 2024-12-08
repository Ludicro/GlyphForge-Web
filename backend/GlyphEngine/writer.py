import GlyphEngine.bases as bases
import GlyphEngine.line_shapes as line_shapes
import numpy as np
import matplotlib.pyplot as plt
import json

cmap = plt.get_cmap('turbo')

def decode_shape(in_array, k=1, point_color='k', on_color='darkred', off_color="grey",
                 label=None, base_fn=bases.polygon, base_kwargs=[],
                 shape_fn=line_shapes.straight, shape_kwargs=[], plot_base=False):
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
                         base_fn=bases.polygon, base_kwargs=[],
                         shape_fn=line_shapes.straight, shape_kwargs=[],
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
        
        if base_fn == bases.polygon:
            plt.legend(loc=legend_loc, fontsize=10, bbox_to_anchor=(-.7, 1.0))
        elif base_fn == bases.quadratic:
            if shape_fn == line_shapes.straight:
                plt.legend(loc=legend_loc, fontsize=10, bbox_to_anchor=(-2, 1.0))
            elif shape_fn == line_shapes.centre_circle:
                plt.legend(loc=legend_loc, fontsize=10, bbox_to_anchor=(-1, 1.0))
        elif base_fn == bases.circle:
            plt.legend(loc=legend_loc, fontsize=10, bbox_to_anchor=(-.5, 1.0))
        elif base_fn == bases.cubic:
            if shape_fn == line_shapes.centre_circle:
                plt.legend(loc=legend_loc, fontsize=10, bbox_to_anchor=(-1, 1.0))
            elif shape_fn == line_shapes.straight:
                plt.legend(loc=legend_loc, fontsize=10, bbox_to_anchor=(-2, 1.0))
        elif base_fn == bases.golden:
            if shape_fn == line_shapes.centre_circle:
                plt.legend(loc=legend_loc, fontsize=10, bbox_to_anchor=(-.7, 1.0))
            elif shape_fn == line_shapes.straight:
                plt.legend(loc=legend_loc, fontsize=10, bbox_to_anchor=(-.5, 1.0))
        
    plt.axis('off')
    plt.axis('scaled')

def draw_spell(level, rang, area, dtype, school, duration, condition, 
               concentration, ritual, base_fn, shape_fn, include_conditions=True,
               savename="output.png", legend=True, base_kwargs=[],
               shape_kwargs=[], colors=[], legend_loc="upper left", breakdown=True):
    plt.clf()

    with open("Attributes/attributes.json", "r") as f:
        attributes = json.load(f)
    
    ranges = attributes["range"]
    levels = attributes["levels"]
    area_types = attributes["area_types"]
    dtypes = attributes["damage_types"]
    schools = attributes["school"]
    durations = attributes["duration"]
    conditions = attributes["conditions"]
    
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
            assert len(colors) == len(attributes)
    else:
        if len(colors) == 0:
            colors = ['blue'] * N
        if len(colors) < N:
            colors.extend(['red'] * (N - len(colors)))

    combinations_path = '/var/task/Uniques/15.npy'
    non_repeating = np.load(combinations_path, allow_pickle=False)
    input_array = np.array([non_repeating[i] for i in attributes])

    draw_multiple_inputs(input_array, concentration, ritual, base_fn=base_fn, labels=labels, legend=legend,
                        base_kwargs=base_kwargs,
                        shape_fn=shape_fn, shape_kwargs=shape_kwargs,
                        colors=colors, legend_loc=legend_loc)

    if ritual:
        if len(colors) > 0:
            plt.plot(0, 0, "", markersize=10, marker=".", color=colors[0])
    if concentration:
        if len(colors) > 1:
            plt.plot(0, 0, "", markersize=20, marker="o", color=colors[1], mfc='none', linewidth=10)

    plt.savefig(savename, transparent=False, bbox_inches='tight')
    plt.clf()
